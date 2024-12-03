import crypto from 'crypto';
import { getRedisClient } from './redis.js';
import { log } from 'console';
// 获取 Redis 客户端实例
const client = getRedisClient();

// 生成验证码
function generateCaptcha() {
    return crypto.randomBytes(3).toString('hex');  // 生成一个 6 位的验证码
}

// 存储验证码到 Redis（使用新的 set 方法）
function storeCaptcha(phone, captcha, timeout = 300) {
    return new Promise((resolve, reject) => {
        try {
            const key = `captcha:${phone}`;
            client.set(key, captcha, {
                EX: timeout,
            })
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
    })


}
// 校验验证码
function validateCaptcha(phone, inputCaptcha) {
    return new Promise(async (resolve, reject) => {
        try {
            const key = `captcha:${phone}`;
            const data = await client.get(key);
            if (inputCaptcha === data) {
                return resolve(true)
            }
        } catch (error) {
            return reject(error)
        }
        return resolve(false)
    })

}

// 清除验证码数据
function clearCaptcha(phone) {
    return new Promise((resolve, reject) => {
        try {
            const key = `captcha:${phone}`;
            client.del(key, (err, response) => {
                if (err) {
                    return reject(err);
                }
                // 如果删除成功，response 为 1；否则为 0
                if (response === 1) {
                    return resolve(true);
                } else {
                    return resolve(false); // 如果没有找到对应的键值
                }
            });
        } catch (error) {
            return reject(error);
        }
    });
}


export { generateCaptcha, storeCaptcha, validateCaptcha, clearCaptcha };
