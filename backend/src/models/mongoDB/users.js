`use strict`

import mongoose from 'mongoose'

const Users = new mongoose.Schema({
	userId: {
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
		default: 2,
		min: 0
	},
	leavesRemaining: {
		type: Number,
		required: true,
		default: 5,
		min: 0
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
