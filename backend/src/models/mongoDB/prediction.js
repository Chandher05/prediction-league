`use strict`

import mongoose from 'mongoose'

const Prediction = new mongoose.Schema({
    confidence: {
        type: String,
        required: true
    },
    predictedTeam: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
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
    predictionTime : {
        type : Date,
        default : Date.now,
    }
}, { versionKey: false })

export default mongoose.model('prediction', Prediction)
