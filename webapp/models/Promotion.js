// Импорты
import mongoose from 'mongoose';

// Акции
const PromotionSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	conditions: { type: String, required: true },
	winners_count: { type: Number, required: true },
	image: { type: String, required: false },
	subscribe: { type: Boolean, required: false },
	start_time: { type: Date, required: true },
	end_time: { type: Date, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
	is_published: { type: Boolean, required: false, default: false }
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);