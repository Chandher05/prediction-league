`use strict`

module.exports = {
	STATUS_CODE: {
		SUCCESS_STATUS: 200,
		CREATED_SUCCESSFULLY_STATUS: 201,
		ACCEPTED_STATUS: 202,
		NO_CONTENT_STATUS: 204,
		BAD_REQUEST_ERROR_STATUS: 400,
		UNAUTHORIZED_ERROR_STATUS: 401,
		FORBIDDEN_ERROR_STATUS: 403,
		NOT_FOUND_STATUS: 404,
		CONFLICT_ERROR_STATUS: 409,
		UNPROCESSABLE_ENTITY_STATUS: 422,
		INTERNAL_SERVER_ERROR_STATUS: 500,
		MOVED_PERMANENTLY: 301,
	},
	MESSAGES: {
		USER_NOT_FOUND: 'User not found',
		USER_ALREADY_EXISTS: 'Username is taken',
		AUTHORIZATION_FAILED: 'Authorization failed',
		USER_VALUES_MISSING: 'Email must be provided',
	},
	PREDICTION_INFO: {
		MAX_LEAVES_PER_PLAYER: 7,
		MAX_FH_PER_PLAYER: 2,
		EXTRA_LEAVES_SCORE: 0.35
	},
	STRATEGY: {
		TOSS_WINNER: "TOSS_WINNER",
		TOSS_LOSER: "TOSS_LOSER",
		BATTING_FIRST: "BATTING_FIRST",
		BOWLING_FIRST: "BOWLING_FIRST",
		NO_BET: "NO_BET",
	}
}
