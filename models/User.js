// Импорты
import mongoose from 'mongoose';

// Пользователи
const UserSchema = new mongoose.Schema({
    telegram_id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    first_name: { type: String, required: true },
    win_date: { type: Date, required: true, default: null },
    first_subscription_date: { type: Date, required: true, default: null },
    paid_subscription: { type: Boolean, required: true, default: false },
    subscription_end_date: { type: Date, required: true, default: null },
    rebill_count: { type: Number, required: true, default: 0 },
    free_limit: { type: Number, required: true, default: 2 }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);