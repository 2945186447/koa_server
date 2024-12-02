import dotenv from 'dotenv';

// 加载 .env 文件中的环境变量
dotenv.config();

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONG_PORT, MONGO_DB_NAME } = process.env;


// 获取 MongoDB URI
const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONG_PORT}/${MONGO_DB_NAME}?options`
console.log(mongoURI);