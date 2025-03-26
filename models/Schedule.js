// Импорты
import mongoose from 'mongoose';

// Акции
const ScheduleSchema = new mongoose.Schema({
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' }
});

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);