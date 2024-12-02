import { loadProcessEnv } from "../utils/dotenv.js";

loadProcessEnv();

export const mongoConfig = {
    user: encodeURIComponent(process.env.MONGO_USER),
    password: encodeURIComponent(process.env.MONGO_PASSWORD),
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    dbName: process.env.MONGO_DB_NAME,
    timeout: process.env.MONGO_TIMEOUT,
    options: {
        maxPoolSize: 10, // 最大连接数
        minPoolSize: 2,  // 最小连接数
        socketTimeoutMS: 45000, // 套接字超时
        serverSelectionTimeoutMS: 5000, // 服务选择超时,
    }
};
