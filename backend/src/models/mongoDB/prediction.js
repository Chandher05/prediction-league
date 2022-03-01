`use strict`

import mongoose from 'mongoose'

const Prediction = new mongoose.Schema({
    confidence: {
        type: String,
        required: true
    },
    predictedTeamId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    userUID: {
        type: String,
        required: true
    },
    gameId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isConsidered : {
        type : Boolean,
        required: true,
        default: true
    },
    isStrategy : {
        type : Boolean,
        required: true,
        default: false
    },
    predictionTime : {
        type : Date,
        default : Date.now,
    }
}, { versionKey: false })

export default mongoose.model('prediction', Prediction)
