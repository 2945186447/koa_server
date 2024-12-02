import mongoose from 'mongoose';
import { mongoConfig } from './config.js';

const { user, password, host, port, dbName, timeout, options } = mongoConfig;
const mongoURI = `mongodb://${user}:${password}@${host}:${port}/${dbName}?connectTimeoutMS=${timeout}`;

const connectToMongoDB = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(mongoURI, options);
            console.log('MongoDB connected successfully');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1); // 连接失败时退出程序
        }
    } else {
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        console.log(`MongoDB is already ${states[mongoose.connection.readyState]}`);
    }

    mongoose.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected, relying on autoReconnect...');
    });
};

connectToMongoDB();

export { mongoose };
