import { mongoose } from '../db/index.js';

const userSchema = new mongoose.Schema(
    {
        md5: { type: String, required: true, unique: true },
        path: { type: String, required: true },
        type: { type: String, required: true },
    },
    {
        _id: true,
        autoIndex: true,
        autoCreate: true,
    } // 自动创建集合
);
const File = mongoose.model('File', userSchema);
export default File;