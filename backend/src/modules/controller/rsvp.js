import rsvp from '../../models/mongoDB/rsvp';
import constants from '../../utils/constants';

/**
 * Get rsvp.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
 exports.getData = async (req, res) => {
 	try {
		let allRsvp = await rsvp.find()
		.sort({rsvpDate : -1})

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(allRsvp)
	} catch (error) {
		console.log(`Error while adding user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Add rsvp.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addRsvp = async (req, res) => {
	try {
		const newRsvp = new rsvp(req.body);
		await newRsvp.save();

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(newRsvp);
	} catch (error) {
		console.log(`Error while adding rsvp ${error}`);
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message);
	}
};


/**
 * Update rsvp.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateRsvp = async (req, res) => {
	try {
		const rsvpId = req.params.id;
		const deletedRsvp = await rsvp.findByIdAndUpdate(rsvpId,
			{ isDeleted: true }
		);
		
		const newRsvp = new rsvp(req.body);
		await newRsvp.save();

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(newRsvp);
	} catch (error) {
		console.log(`Error while adding rsvp ${error}`);
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message);
	}
};


/**
 * Delete rsvp.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deleteRsvp = async (req, res) => {
	try {
		const rsvpId = req.params.id;
		const deletedRsvp = await rsvp.findByIdAndUpdate(rsvpId,
			{ isDeleted: true }
		);

		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(deletedRsvp);
	} catch (error) {
		console.log(`Error while adding rsvp ${error}`);
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message);
	}
};