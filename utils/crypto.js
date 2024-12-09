import crypto from 'crypto';
import fs from 'fs';
import { log } from 'console';

// 生成密钥对
function generateKeyPair() {
    if (fs.existsSync('./pem/secretKey.pem')
        || fs.existsSync('./pem/iv.pem')
        || fs.existsSync('./pem/publicKey.pem')
        || fs.existsSync('./pem/privateKey.pem')) {
        log('密钥对已存在');
        return
    }
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    const iv = crypto.randomBytes(16); // 初始化向量
    const secretKey = crypto.randomBytes(32);
    fs.writeFileSync('./pem/secretKey.pem', secretKey);
    fs.writeFileSync('./pem/iv.pem', iv);
    fs.writeFileSync('./pem/publicKey.pem', publicKey);
    fs.writeFileSync('./pem/privateKey.pem', privateKey);
    return { publicKey, privateKey, iv, secretKey };
}
function getEncryptConfig() {
    const iv = fs.readFileSync('./pem/iv.pem');
    const secretKey = fs.readFileSync('./pem/secretKey.pem');
    const publicKey = fs.readFileSync('./pem/publicKey.pem', 'utf8');
    const privateKey = fs.readFileSync('./pem/privateKey.pem', 'utf8');
    return { iv, secretKey, publicKey, privateKey };
}
// 加密和解密函数
function encryptWithAES(data, iv, secretKey) {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { iv: iv.toString('base64'), encryptedData: encrypted };
}

function decryptWithAES(encryptedData, secretKey, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(iv, 'base64'));
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export function encrypt(data) {
    const { iv, secretKey } = getEncryptConfig();
    const { encryptedData } = encryptWithAES(data, iv, secretKey);
    return encryptedData
}
export function decrypt(encryptedData) {
    const { iv, secretKey } = getEncryptConfig();
    return decryptWithAES(encryptedData, secretKey, iv);
}
