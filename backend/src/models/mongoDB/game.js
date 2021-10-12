`use strict`

import mongoose from 'mongoose'

const Game = new mongoose.Schema({
    gameNumber: {
        type: Number,
        required: true
    },
    team1: {
        type: String,
        required: true
    },
    team2: {
        type: String,
        required: true
    },
    startTime: {
        type : Date,
        required: true
    },
    winner: {
        type: String,
    }
}, { versionKey: false })

export default mongoose.model('game', Game)
