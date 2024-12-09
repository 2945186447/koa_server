import Router from 'koa-router';
import Joi from "joi"
import { clearCaptcha, validateCaptcha } from '../utils/captcha.js';
const router = new Router();
const prefix = '/users'
router.prefix(prefix)
import User from '../models/user.js'

router.get('/login', function (ctx, next) {

})

router.get('/register', async function (ctx, next) {
  try {
    const { username, code } = ctx.request.body
    const schema = Joi.object({
      username: Joi.string()
        .email({ tlds: { allow: false } }) // 只验证邮箱格式，不限制域名
        .required()
        .messages({
          'string.empty': 'email cannot be empty',
          'any.required': 'email is required',
          'string.email': 'Please provide a valid email address'
        }),
      code: Joi.string()
        .required()
        .length(6)
        .messages({
          'string.empty': 'code cannot be empty',
          'any.required': 'code is required',
          'string.length': 'code must be 6 characters long'
        })
    });
    const { error, value } = schema.validate({ username, code });
    if (error) {
      return ctx.body = {
        message: error.details[0].message,
        data: null
      }
    }
    const res = await validateCaptcha(username, code)
    res && clearCaptcha(username)
    // 插入一条新用户数据
    res && await User.create({
      username,
    });
    return ctx.body = {
      message: res ? '注册成功' : '验证码错误',
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
