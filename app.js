import Koa from 'koa';
import views from 'koa-views';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import winston from 'winston';
import { format } from 'date-fns';  // 引入 date-fns 用来格式化时间
import { loadProcessEnv } from "./utils/dotenv.js"
import swaggerUi from 'koa2-swagger-ui';
import path from 'path';
import fs from 'fs';
import koaStatic from 'koa-static';
import index from './routes/index.js';
import users from './routes/users.js';



// 获取当前模块的目录
const __dirname = path.dirname(new URL(import.meta.url).pathname);
loadProcessEnv()

// 创建 Koa 应用
const app = new Koa();

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());

// 创建 koa-logger 中间件，将日志输出到 winston
if (process.env.environment === 'production') {
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

// swagger
if (process.env.environment === 'development') {
  // 暴露静态文件夹
  app.use(koaStatic(__dirname + '/swigger'));
  app.use(async (ctx, next) => {
    if (ctx.path === '/swagger.json') {
      const swaggerFilePath = path.join(__dirname, 'swigger', 'swigger.json');
      console.log(`swagger.json path: ${swaggerFilePath}`); // 输出路径
      try {
        // 使用 fs.readFileSync 读取文件内容
        const swaggerFileContent = fs.readFileSync(swaggerFilePath, 'utf8');
        ctx.type = 'json';
        ctx.body = JSON.parse(swaggerFileContent); // 解析 JSON 内容并返回
      } catch (err) {
        ctx.status = 404;
        ctx.body = { message: "swigger.json not found or unable to read" };
        console.error(err); // 输出错误信息
      }
    } else {
      await next();
    }
  });

  // 使用 koa-swagger-ui 提供 Swagger UI
  app.use(swaggerUi.koaSwagger({
    routePrefix: '/swagger',   // Swagger UI 的路由路径
    swaggerOptions: {
      url: '/swagger.json',     // Swagger JSON 的路径
    },
  }));
}

app.use(koaStatic(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));


// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

export default app;
