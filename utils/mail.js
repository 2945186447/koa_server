import nodemailer from "nodemailer"
import { loadProcessEnv } from "../utils/dotenv.js";
loadProcessEnv();
// 创建邮件发送器
const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,  // 可以选择不同的邮件服务商，比如 'gmail', 'yahoo', 'smtp', 等等
    secure: true,
    auth: {
        user: process.env.MAIL_USER,  // 使用你自己的邮箱地址
        pass: process.env.MAIL_PASS    // 使用你邮箱的密码或授权码
    }
});
// 发送邮件函数
function sendMail(to, code) {
    let options = {
        from: '"邮箱提醒" <dfgajfg@qq.com>',
        to: `<${to}>`,
        bcc: "密送",
        subject: "koa-server验证码通知",
        html: `<p>您的验证码为：<b>${code}</b>，5分钟内有效</p>`,
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}
export { sendMail };
