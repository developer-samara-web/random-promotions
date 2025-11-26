// Импорты
import mongoose from 'mongoose';

// Раздачи
const PromotionSchema = new mongoose.Schema({
	title: { type: String, required: true }, // Имя раздачи
	index: { type: Number, required: true }, // Порядковый номер раздачи
	messages: {
		public_id: { type: Number }, // ID Сообщения в публичном канале
		private_id: { type: Number }, // ID Сообщения в телеграм
		public_result_id: { type: Number }, // ID Сообщения с результатами в публичном канале
		private_result_id: { type: Number }, // ID Сообщения с результатами в приватном канале
	},
	is_private: { type: Boolean, default: false }, // Вид раздачи (true - только для премиум подписчиков)
	description: { type: String, required: true }, // Текст раздачи
	count: { type: Number, required: true }, // Число победителей
	image: { type: String }, // Фото раздачи
	start_date: { type: Date, required: true }, // Дата начала раздачи
	end_date: { type: Date, required: true }, // Дата окончания раздачи
	creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Автор раздачи
	status: { type: String, enum: ['draft', 'active', 'completed', 'archived'], default: 'draft' }, // Статус раздачи
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);	