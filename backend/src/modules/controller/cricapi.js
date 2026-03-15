import Teams from '../../models/mongoDB/team';
import Game from '../../models/mongoDB/game';
import constants from '../../utils/constants';
import config from '../../../config';
const axios = require('axios');

// parse a date string from CricAPI which is in GMT (e.g. "2026-04-04T10:00:00")
// If the string lacks a timezone suffix, append 'Z' to force UTC parsing.
function parseGMTDate(dateStr) {
	if (!dateStr) return null;
	const tzPattern = /Z|[+-]\d{2}(:?\d{2})?$/i;
	let iso = String(dateStr).trim();
	if (!tzPattern.test(iso)) iso = iso + 'Z';
	const d = new Date(iso);
	return isNaN(d.getTime()) ? null : d;
}

/**
 * Get series ID and related team information.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getSeriesId = async (req, res) => {
	try {

		const url = `https://api.cricapi.com/v1/series?apikey=${config.cricapi.key}&&offset=0`;
		const apiRes = await axios.get(url);
		const body = apiRes.data || {};
		
        const rawList = body.data || body.series || [];
        const seen = new Set();
        const series = [];

        for (const s of rawList) {
            const id = s.id || s._id || s.series_id || s.seriesId;
            const name = s.name || s.seriesName || s.title || '';
            if (id && !seen.has(id)) {
                seen.add(id);
                series.push({ id, name });
            }
        }

        return res
            .status(constants.STATUS_CODE.SUCCESS_STATUS)
            .send({ series });

	} catch (error) {
		console.log(`Error while adding team ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Add an team in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.validateAndAddTeams = async (req, res) => {
	try {

		const seriesId = req.body.seriesId;
		if (!seriesId) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send('seriesId is required');
		}

		const url = `https://api.cricapi.com/v1/series_info?apikey=${config.cricapi.key}&id=${seriesId}`;
		const apiRes = await axios.get(url);
		const body = apiRes.data || {};

		if (body.status && String(body.status).toLowerCase() === 'failure') {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send('Invalid series id');
		}

		const matchList = (body.data && body.data.matchList) || body.matchList || [];
		const teamSet = new Set();
		for (const match of matchList) {
			if (match && Array.isArray(match.teams)) {
				for (const t of match.teams) {
					if (t && typeof t === 'string') teamSet.add(t.trim());
				}
			}
		}

		// Load known team name mappings
		const teamNames = require('../../utils/teamNames');

		const missing = [];
		const teamsToAdd = [];
		for (const fullName of Array.from(teamSet)) {
			const mapping = teamNames[fullName];
			if (!mapping) {
				missing.push(fullName);
			} else {
				teamsToAdd.push({
					fullName: mapping.fullName,
					shortName: mapping.shortName,
					colorCode: mapping.colorCode || '#000000',
				});
			}
		}

		if (missing.length > 0) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send({ missing });
		}

		// Check for existing teams in DB (by shortName)
		// Check for existing teams in DB (by shortName) and prepare insertion list
		const skipped = [];
		const toInsert = [];
		for (const t of teamsToAdd) {
			const found = await Teams.findOne({ shortName: t.shortName });
			if (found) skipped.push(t.shortName);
			else toInsert.push(t);
		}

		// Insert only teams that do not already exist
		const created = [];
		for (const t of toInsert) {
			const teamData = new Teams({
				fullName: t.fullName,
				shortName: t.shortName,
				colorCode: t.colorCode,
			});
			await teamData.save();
			created.push(teamData);
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({ createdCount: created.length, created, skipped });
	} catch (error) {
		console.log(`Error while adding team ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.getGames = async (req, res) => {
	try {
		const seriesId = (req.query && req.query.seriesId);
		if (!seriesId) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send('seriesId is required');
		}

		const url = `https://api.cricapi.com/v1/series_info?apikey=${config.cricapi.key}&id=${seriesId}`;
		const apiRes = await axios.get(url);
		const body = apiRes.data || {};

		const matchList = (body.data && body.data.matchList) || body.matchList || [];
		const results = [];

		for (const match of matchList) {
			const matchId = match.id || match._id || '';

			// teams
			const teams = Array.isArray(match.teams) ? match.teams : (match.teamInfo || []).map(t => t.name);
			const team1 = teams[0] || '';
			const team2 = teams[1] || '';

			// determine start time and timestamp for sorting
			const startTimeRaw = match.dateTimeGMT || match.date || null;
			const parsedDate = startTimeRaw ? parseGMTDate(startTimeRaw) : null;
			const ts = parsedDate ? parsedDate.getTime() : Number.MAX_SAFE_INTEGER;

			const found = await Game.findOne({ cricApiMatchId: matchId });

			results.push({
				matchId,
				team1,
				team2,
				startTime: startTimeRaw,
				_ts: ts,
				inDB: !!found
			});
		}

		// sort by timestamp (earlier first)
		results.sort((a, b) => a._ts - b._ts);

		// assign sequential gameNumber based on sorted order
		results.forEach((r, idx) => {
			r.gameNumber = idx + 1;
			delete r._ts; // remove internal timestamp
		});

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send({ games: results });
	} catch (error) {
		console.log(`Error while fetching games ${error}`);
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message);
	}
}

/**
 * Add multiple games from cricapi series_info response.
 * Body: { seriesId: string, matchIds: [string] }
 */
exports.addGames = async (req, res) => {
	try {
		const seriesId = (req.body && req.body.seriesId);
		const matchIds = (req.body && req.body.matchIds) || [];

		if (!seriesId) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send('seriesId is required');
		}
		if (!Array.isArray(matchIds) || matchIds.length === 0) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send('matchIds (array) is required');
		}

		const url = `https://api.cricapi.com/v1/series_info?apikey=${config.cricapi.key}&id=${seriesId}`;
		const apiRes = await axios.get(url);
		const body = apiRes.data || {};

		const matchList = (body.data && body.data.matchList) || body.matchList || [];
		const matchMap = new Map();
		for (const m of matchList) {
			if (m && m.id) matchMap.set(m.id, m);
		}

		// load teams mapping: fullName -> _id
		const allTeams = await Teams.find();
		const teamNameToId = {};
		for (const t of allTeams) {
			teamNameToId[t.fullName] = t._id;
		}

		const added = [];
		const existing = [];
		const invalid = [];

		// compute gameNumber by sorting the cricapi match list by start time
		const sortable = [];
		for (const m of matchList) {
			const startRaw = m && (m.dateTimeGMT || m.date) ? (m.dateTimeGMT || m.date) : null;
			const d = startRaw ? new Date(startRaw) : null;
			const ts = d && !isNaN(d.getTime()) ? d.getTime() : Number.MAX_SAFE_INTEGER;
			if (m && m.id) sortable.push({ id: m.id, ts });
		}
		sortable.sort((a, b) => a.ts - b.ts);

		const positionMap = new Map();
		for (let i = 0; i < sortable.length; i++) {
			positionMap.set(sortable[i].id, i + 1);
		}

		for (const mid of matchIds) {
			const match = matchMap.get(mid);
			if (!match) {
				invalid.push(mid);
				continue;
			}

			// check already exists
			const exists = await Game.findOne({ cricApiMatchId: mid });
			if (exists) {
				existing.push(exists);
				continue;
			}

			const teams = Array.isArray(match.teams) ? match.teams : (match.teamInfo || []).map(t => t.name);
			const team1Name = teams[0] || '';
			const team2Name = teams[1] || '';

			const team1Id = teamNameToId[team1Name];
			const team2Id = teamNameToId[team2Name];

			if (!team1Id || !team2Id || team1Id.toString() === team2Id.toString()) {
				invalid.push(mid);
				continue;
			}

			// prepare game object using logic from addGame
			const startTime = match.dateTimeGMT ? parseGMTDate(match.dateTimeGMT) : (match.date ? parseGMTDate(match.date) : null);
			if (!startTime) {
				invalid.push(mid);
				continue;
			}

			// assign gameNumber based on sorted API list position; if taken, find next free number
			let gameNumber = positionMap.has(mid) ? positionMap.get(mid) : null;
			if (!gameNumber) {
				// fallback: pick max+1
				const maxGame = await Game.findOne().sort({ gameNumber: -1 });
				gameNumber = maxGame && maxGame.gameNumber ? maxGame.gameNumber + 1 : 1;
			}

			// ensure gameNumber not already used by other DB game (different cricApiMatchId)
			while (true) {
				const conflict = await Game.findOne({ gameNumber: gameNumber });
				if (!conflict) break;
				// if conflict exists but it's for the same cricApiMatchId (unlikely since we checked exists earlier), break
				if (conflict.cricApiMatchId && conflict.cricApiMatchId.toString() === mid.toString()) break;
				gameNumber += 1;
			}

			const gameObj = new Game({
				gameNumber: gameNumber,
				team1: team1Id,
				team2: team2Id,
				startTime: startTime,
				cricApiMatchId: mid,
				battingFirst: null,
				toss: null,
				winner: null
			});

			await gameObj.save();
			added.push(gameObj);
		}

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send({ added, existing, invalid });
	} catch (error) {
		console.log(`Error while adding games ${error}`);
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message);
	}
}