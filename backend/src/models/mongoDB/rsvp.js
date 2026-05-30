`use strict`

import mongoose from 'mongoose'

const RSVP = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	guests: {
		type: Number,
		required: true,
	},
	attending: {
		type: Boolean,
		required: true,
	},
	message: {
		type: String
	},
    rsvpDate : {
        type : Date,
        default : Date.now,
    },
	isDeleted: {
		type: Boolean,
		default: false,
	}
}, { versionKey: false })

export default mongoose.model('rsvp', RSVP)
