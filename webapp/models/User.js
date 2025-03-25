// Импорты
import mongoose from 'mongoose';

// Пользователи
const UserSchema = new mongoose.Schema({
    is_admin: { type: Boolean, default: false }, // Роль в системе
    telegram_id: { type: Number, required: true, unique: true }, // id телеграмма
    username: { type: String, required: true }, // Ник пользователя
    first_name: { type: String, required: true }, // Имя пользователя
    win_date: { type: Date, default: null }, // Дата последнего выигрыша
    first_subscription_date: { type: Date, default: null }, // Дата первой подписки
    is_subscription: { type: Boolean, default: false }, // Статус подписки
    is_auto_subscription: { type: Boolean, default: false }, // Статус проделния подписки
    subscription_end_date: { type: Date,  default: null }, // Дата окончания подписки
    rebill_count: { type: Number, default: 0 }, // Кол-во продлений подписки
    free_limit: { type: Number, default: 2 }, // Бесплатный лимит
    subscribe_channel: { type: Boolean, default: false }, // Подписка на канал
    participation: [ // Участие в акциях
		{
			promotion: {
				type: Number,
				ref: 'Promotion',
				required: true,
			},
			status: {
				type: String,
				enum: ['winner', 'looser', 'pending'],
				default: 'pending',
				required: true,
			},
			date: {
				type: Date,
				default: Date.now,
				required: true,
			}
		}
	]
});

export default mongoose.models.User || mongoose.model('User', UserSchema);