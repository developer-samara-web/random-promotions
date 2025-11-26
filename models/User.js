// Импорты
import mongoose from 'mongoose';

// Пользователи
const UserSchema = new mongoose.Schema({
	is_admin: { type: Boolean, default: false }, // Роль пользователя
	telegram_id: { type: Number, required: true, unique: true }, // ID пользователя телеграма
	username: { type: String, default: 'username' }, // Ник пользователя
	first_name: { type: String, required: true }, // Имя пользователя
	subscriptions: {
		public: {
			is_subscribe: { type: Boolean, default: false } // Cтатус подписки на открытый канал
		},
		private: {
			tribute_id: { type: Number }, // ID Трибьюта
			is_subscribe: { type: Boolean, default: false }, // Статус подписки на закрытый канал
			period: { type: String, enum: ['monthly', 'weekly'] }, // Период подписки
			expires_at: { type: Date } // Дата окончания подписки
		}
	},
	stats: { // Статистика
		last_win_date: { type: Date, default: null }, // Последняя дата победы
		free_participations: { type: Number, default: 2 } // Бесплатный лимит участий
	},
	created_at: { type: Date, default: Date.now }, // Дата создания акканта
	updated_at: { type: Date, default: Date.now } // Дата обновления аккаунта
});

export default mongoose.models.User || mongoose.model('User', UserSchema);