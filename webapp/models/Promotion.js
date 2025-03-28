// Импорты
import mongoose from 'mongoose';

// Акции
const PromotionSchema = new mongoose.Schema({
	title: { type: String, required: true }, // Имя акции
	title_id: { type: Number, required: true }, // Порядковы йномер акции
	message_id: { type: Number }, // ID Сообщения в телеграм
	description: { type: String, required: true }, // Текст акции
	winners_count: { type: Number, required: true }, // Число победителей
	banner_image: { type: String }, // Фото акции
	requires_subscription: { type: Boolean, default: false }, // Вид акции (true - только для премиум подписчиков)
	start_date: { type: Date, required: true }, // Дата начала акции
	end_date: { type: Date, required: true }, // Дата окончания акции
	creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Автор акции
	status: { type: String, enum: ['draft', 'active', 'completed', 'archived'], default: 'draft' }, // Статус акции
	created_at: { type: Date, default: Date.now }, // Дата создания акции
	updated_at: { type: Date, default: Date.now } // Дата обновления акции
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);	