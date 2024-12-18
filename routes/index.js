import Router from 'koa-router';
const router = new Router();

// import { jwtEncrypt, tokenHandler } from "../utils/jwt.js"
// import koaJwt from "koa-jwt"
// const jwtExcludePaths = [
//   '*/*'
// ];
// router.use(tokenHandler);
// router.use(koaJwt({ secret: process.env.SECRET_KEY }).unless({ path: jwtExcludePaths }));
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {

  ctx.body = {
    title: 'koa2 json'
  }
})

export default router
