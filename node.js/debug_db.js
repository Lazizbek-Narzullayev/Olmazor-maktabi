import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Users } from './users/userModel.js';
import { Schedule } from './schedule/scheduleModel.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        
        const sch = await Schedule.find({}).limit(10).populate('classId').populate('teacherId');
        console.log("Schedules found:", JSON.stringify(sch, null, 2));
        
        const ts = await Users.find({ role: 'teacher' }).select('name _id');
        console.log("Teachers found:", JSON.stringify(ts, null, 2));

        const cls = await mongoose.model('Class').find({}).select('name _id');
        console.log("Classes found:", JSON.stringify(cls, null, 2));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
