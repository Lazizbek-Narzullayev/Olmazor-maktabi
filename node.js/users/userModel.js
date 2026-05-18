import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    plainPassword: {
        type: String,
    },
    image: {
        type: String,
    },
    specialization: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student',
    },
    isFirstLogin: {
        type: Boolean,
        default: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        default: null,
    },
    subjectIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    }],
    phoneNumber: {
        type: String,
    },
    joinedDate: {
        type: Date,
        default: Date.now,
    },
    graduatedTalentsCount: {
        type: Number,
        default: 0,
    },
    olympiads: [{
        type: String,
    }],
}, { timestamps: true });

export const Users = mongoose.model('Users', userSchema);