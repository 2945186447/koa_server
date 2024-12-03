import { required } from 'joi';
import { mongoose } from '../db/index.js';

const userSchema = new mongoose.Schema(
    {

        username: { type: String, required: true },
        password: { type: String, required: true },
        gender: { type: Number, required: true },
    },
    {
        autoCreate: true,
        _id: true
    } // 自动创建集合
);

const User = mongoose.model('User', userSchema);

export default User;
