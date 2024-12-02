import dotenv from 'dotenv';

export const loadProcessEnv = () => {
    const environment = process.env.NODE_ENV || 'production';
    // 读取不同环境的配置
    dotenv.config({ path: `./.env.${environment}` });
};