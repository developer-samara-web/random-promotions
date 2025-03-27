// Импорты
import mongoose from 'mongoose';

// Акции
const PromotionSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	winners_count: { type: Number, required: true },
	image: { type: String, required: false },
	subscribe: { type: Boolean, required: false },
	start_time: { type: Date, required: true },
	end_time: { type: Date, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
	is_published: { type: Boolean, required: false, default: false },
	participants: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
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
	],
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);