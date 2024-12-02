import { mongoose } from '../db/index.js';

const userSchema = new mongoose.Schema(
    {

        name: { type: String, required: true },
        age: { type: Number, required: true, min: 0 },
    },
    {
        autoCreate: true,
        _id: true
    } // 自动创建集合
);

const User = mongoose.model('User', userSchema);

export default User;
