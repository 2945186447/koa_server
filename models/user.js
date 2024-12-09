import { mongoose } from '../db/index.js';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
    },
    {
        _id: true,
        autoIndex: true,
    } // 自动创建集合
);


const User = mongoose.model('User', userSchema);



export default User;
