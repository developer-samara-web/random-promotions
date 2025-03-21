// Импорты
import mongoose from 'mongoose';

// Акции
const ScheduleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    schedule: { type: String, required: true },
    task: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);