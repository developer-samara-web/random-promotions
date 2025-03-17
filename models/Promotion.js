// Импорты
import mongoose from 'mongoose';

// Пользователи
const PromotionSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true, unique: true },
	conditions: { type: String, required: true, unique: true },
	image_url: { type: String, required: true, unique: true },
	is_premium: { type: Boolean, required: true, unique: true },
	start_time: { type: Date, required: true, unique: true },
	end_time: { type: Date, required: true, unique: true },
	winners_count: { type: Number, required: true, unique: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null }
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);