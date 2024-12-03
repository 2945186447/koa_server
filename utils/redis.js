import redis from 'redis';
import { loadProcessEnv } from "../utils/dotenv.js";
loadProcessEnv();

// 创建一个 Redis 客户端单例
let client = null;
console.log("Redis Host:", process.env.REDIS_HOST);   // 输出：175.178.41.25
console.log("Redis Port:", process.env.REDIS_PORT);   // 输出：6379
console.log("Redis Password:", process.env.REDIS_PASSWORD);   // 输出：96123
function getRedisClient() {
    if (!client) {
        // 如果客户端尚未创建，则创建并连接
        client = redis.createClient({
            host: process.env.REDIS_HOST,  // Redis 主机地址
            port: process.env.REDIS_PORT,  // Redis 端口
            password: process.env.REDIS_PASSWORD  // Redis 密码
        });

        // 连接 Redis 数据库
        client.on('connect', function () {
            console.log('Connected to Redis');
        });

        // 处理错误
        client.on('error', function (err) {
            console.log('Redis Error: ' + err);
        });
    } else {
        if (client.connected) {
            console.log('Redis already connected');
        } else {
            console.log('Redis connection lost, reconnecting...');
            client.connect();
        }
    }

    return client;
}

export { getRedisClient };