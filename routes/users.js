import Router from 'koa-router';
const router = new Router();
import { jwtEncrypt } from "../utils/jwt.js"


router.prefix('/users')

router.get('/login', function (ctx, next) {
  console.log(jwtEncrypt({ name: "admin" }));
  ctx.body = 'this is a users response!'
})

router.get('/register', function (ctx, next) {
  console.log("NB");
  console.log(ctx.state);
  ctx.body = 'this is a users/bar response'
})

export default router
