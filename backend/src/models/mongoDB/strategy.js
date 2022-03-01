`use strict`

import mongoose from 'mongoose'

const Strategy = new mongoose.Schema({
	userId: {
        type: mongoose.Types.ObjectId,
        required: true
	},
	userUID: {
		type: String,
		required: true,
	},
	confidence: {
		type: String,
		required: true,
	},
	typeOfStrategy: {
		type: String,
		required: true,
	}
}, { versionKey: false })

export default mongoose.model('strategy', Strategy)
