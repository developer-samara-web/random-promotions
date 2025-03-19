// Импорты
import mongoose from 'mongoose';

// Акции
const PromotionSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	conditions: { type: String, required: true },
	image_url: { type: String, required: true },
	is_premium: { type: Boolean, required: true },
	start_time: { type: Date, required: true },
	end_time: { type: Date, required: true },
	winners_count: { type: Number, required: true },
	is_published: { type: Boolean, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null }
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);