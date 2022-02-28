`use strict`

import mongoose from 'mongoose'
import constants from '../../utils/constants'

const Users = new mongoose.Schema({
	userUID: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		maxlength: 50,
		required: true,
	},
    email: {
		type: String,
        required: true
    },
	totalScore: {
		type: Number,
		required: true,
		default: 0
	},
	freeHitsRemaining: {
		type: Number,
		required: true,
		default: constants.PREDICTION_INFO.MAX_FH_PER_PLAYER,
		min: 0
	},
	leavesRemaining: {
		type: Number,
		required: true,
		default: constants.PREDICTION_INFO.MAX_LEAVES_PER_PLAYER,
		min: 0
	},
	positionOnLeaderoard:{
		type: Number,
		required: true,
		default: 0
	},
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
	sendEmail: {
		type: Boolean,
        required: true,
        default: true	
	},
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { versionKey: false })

export default mongoose.model('users', Users)
