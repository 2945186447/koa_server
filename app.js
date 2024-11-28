const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const winston = require('winston');
const { format } = require('date-fns');  // 引入 date-fns 用来格式化时间
const dotenv = require('dotenv');
const index = require('./routes/index')
const users = require('./routes/users')
const environment = process.env.NODE_ENV || 'production';
// 读取不同环境的配置
dotenv.config({ path: `.env.${environment}` });
// error handler
onerror(app)
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())

// 创建 koa-logger 中间件，将日志输出到 winston
if (environment === 'production') {
  // 创建自定义的 winston 日志格式，使用 date-fns 格式化时间戳
  const loggerInstance = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: () => format(new Date(), 'yyyy-MM-dd HH:mm:ss')  // 自定义时间格式
      }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;  // 使用自定义的时间格式
      })
    ),
    transports: [
      new winston.transports.Console(),  // 输出到控制台
      new winston.transports.File({ filename: `logs/${format(new Date(), 'yyyy-MM-dd')}.log` })  // 输出到文件
    ]
  });
  // 重写 console.log 将日志同时输出到 winston 和控制台
  console.log = (...args) => {
    // 输出到 winston
    loggerInstance.info(args.join(' '));
    // 输出到控制台（保留原生行为）
    process.stdout.write(args.join(' ') + '\n');
  };
  app.use(logger((str, args) => {
    loggerInstance.info(str.replace(/\u001b\[[0-9;]*m/g, '')); // 去掉颜色转义字符
  }));
}
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
