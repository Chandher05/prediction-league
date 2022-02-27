`use strict`

import mongoose from 'mongoose'

const Game = new mongoose.Schema({
    gameNumber: {
        type: Number,
        required: true
    },
    team1: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    team2: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    startTime: {
        type : Date,
        required: true
    },
    winner: {
        type: mongoose.Types.ObjectId,
    }
}, { versionKey: false })

export default mongoose.model('game', Game)
