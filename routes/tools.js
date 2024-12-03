import Router from 'koa-router';
import Joi from "joi"
import { generateCaptcha, storeCaptcha, validateCaptcha, clearCaptcha } from "../utils/captcha.js"
import { sendMail } from "../utils/mail.js"
const router = new Router();
router.prefix('/tools')
router.post('/sendCaptcha', async (ctx, next) => {
    try {
        const { email } = ctx.request.body
        const schema = Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } }) // 只验证邮箱格式，不限制域名
                .required()
                .messages({
                    'string.empty': 'email cannot be empty',
                    'any.required': 'email is required',
                    'string.email': 'Please provide a valid email address'
                })
        });
        const { error, value } = schema.validate({ email });
        if (error) {
            return ctx.body = {
                message: error.details[0].message,
                data: null
            }
        }
        const code = generateCaptcha()
        const res = await storeCaptcha(value.email, code)
        await sendMail(email, code)
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

router.post('/verifyCaptcha', async (ctx, next) => {
    try {
        const { email, code } = ctx.request.body
        const res = await validateCaptcha(email, code)
        res && clearCaptcha(email)
        return ctx.body = {
            message: res ? 'success' : 'fail',
            data: null
        }
    } catch (error) {
        return ctx.body = {
            message: error.message,
            data: null
        }
    }

})


export default router
