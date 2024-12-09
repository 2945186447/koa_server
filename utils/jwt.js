import jwt from 'jsonwebtoken';
import { loadProcessEnv } from "../utils/dotenv.js";

loadProcessEnv();
const SECRET_KEY = process.env.SECRET_KEY;

export async function tokenHandler(ctx, next) {
    try {
        await next(); // 继续执行请求处理
    } catch (err) {
        console.log(err.status);
        if (err.status === 401) {
            // 如果是未认证错误（401），则返回自定义错误消息
            ctx.status = 401;
            console.log(ctx.request.header.authorization);
            console.log(jwtDecrypt(ctx.request.header.authorization));

            return ctx.body = {
                data: null,
                message: "unauthorized"
            };
        } else {
            return ctx.body = {
                data: null,
                message: err.message
            };
        }

    }
}

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

