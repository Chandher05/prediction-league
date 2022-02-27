`use strict`

import mongoose from 'mongoose'

const Teams = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
	},
	shortName: {
		type: String,
		required: true,
	},
	colorCode: {
		type: String,
		required: true,
	},
	logo: {
		type: String
	}
}, { versionKey: false })

export default mongoose.model('teams', Teams)
