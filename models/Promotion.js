// Импорты
import mongoose from 'mongoose';

// Раздачи
const PromotionSchema = new mongoose.Schema({
	title: { type: String, required: true }, // Имя раздачи
	title_id: { type: Number, required: true }, // Порядковы йномер раздачи
	message_id: { type: Number }, // ID Сообщения в телеграм
	description: { type: String, required: true }, // Текст раздачи
	winners_count: { type: Number, required: true }, // Число победителей
	banner_image: { type: String }, // Фото раздачи
	requires_subscription: { type: Boolean, default: false }, // Вид раздачи (true - только для премиум подписчиков)
	start_date: { type: Date, required: true }, // Дата начала раздачи
	end_date: { type: Date, required: true }, // Дата окончания раздачи
	creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Автор раздачи
	status: { type: String, enum: ['draft', 'active', 'completed', 'archived'], default: 'draft' }, // Статус раздачи
	created_at: { type: Date, default: Date.now }, // Дата создания раздачи
	updated_at: { type: Date, default: Date.now } // Дата обновления раздачи
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);