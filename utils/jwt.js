import jwt from 'jsonwebtoken';
import { loadProcessEnv } from "../utils/dotenv.js";
loadProcessEnv();
const SECRET_KEY = process.env.SECRET_KEY;
// 加密函数：生成 JWT
export function jwtEncrypt(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
}

// 解密函数：验证和解码 JWT
export function jwtDecrypt(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        // 如果解密失败，返回错误信息
        return { error: 'Invalid token or token expired' };
    }
}