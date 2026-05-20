import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Class } from './classes/classModel.js';

dotenv.config();

async function list() {
    await mongoose.connect(process.env.MONGO_URI);
    const classes = await Class.find({});
    console.log("=== CLASSES IN DATABASE ===");
    classes.forEach(c => {
        console.log(`- ID: ${c._id} | Name: "${c.name}" | Students count: ${c.studentIds.length}`);
    });
    await mongoose.disconnect();
}

list().catch(console.error);
