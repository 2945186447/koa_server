import Router from 'koa-router';
import Joi from "joi"
import { generateCaptcha, storeCaptcha } from "../utils/captcha.js"
import { sendMail } from "../utils/mail.js"
const router = new Router();
router.prefix('/tools')

router.post('/sendCaptcha', async (ctx, next) => {


    try {
        const { username } = ctx.request.body
        const schema = Joi.object({
            username: Joi.string()
                .email({ tlds: { allow: false } }) // 只验证邮箱格式，不限制域名
                .required()
                .messages({
                    'string.empty': 'username cannot be empty',
                    'any.required': 'username is required',
                    'string.email': 'Please provide a valid email address'
                })
        });
        const { error, value } = schema.validate({ username });
        if (error) {
            return ctx.body = {
                message: error.details[0].message,
                data: null
            }
        }
        const code = generateCaptcha()
        const res = await storeCaptcha(value.username, code)
        await sendMail(username, code)
        return ctx.body = {
            message: res ? 'success' : 'fail',
            data: null,
        }
    } catch (error) {
        return ctx.body = {
            message: error.message,
            data: null
        }
    }
})
export default router
