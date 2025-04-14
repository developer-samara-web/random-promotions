// Импорты
import mongoose from 'mongoose';

// Пользователи
const UserSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Ротль пользователя
    telegram_id: { type: Number, required: true, unique: true }, // ID пользователя телеграма
    username: { type: String, default: 'username' }, // Ник пользователя
    first_name: { type: String, required: true }, // Имя пользователя
    subscription: { // Подписка "Премиум"
        is_active: { type: Boolean, default: false }, // Активность подписки
        is_auto_renewal: { type: Boolean, default: false }, // Автопродление
        start_date: { type: Date, default: null }, // Дата начала подписки
        end_date: { type: Date, default: null }, // Дата окончания подписки
        renewal_count: { type: Number, default: 0 }, // Кол-во обновлений подписки
        id: { type: String }
    },
    stats: { // Статистика
        last_win_date: { type: Date, default: null }, // Последняя дата победы
        free_participations: { type: Number, default: 2 } // Бесплатный лимит участий
    },
    channel_subscription: { type: Boolean, default: false }, // Подписка на канал
    created_at: { type: Date, default: Date.now }, // Дата создания акканта
    updated_at: { type: Date, default: Date.now } // Дата обновления аккаунта
});

export default mongoose.models.User || mongoose.model('User', UserSchema);