// Импорты
import mongoose from 'mongoose';

// Задачи планировщика
const ScheduleSchema = new mongoose.Schema({
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: true }, // ID Акции
    start_date: { type: Date, required: true }, // Дата начала задачи
    end_date: { type: Date, required: true }, // Дата окончания задачи
    status: { type: String, enum: ['scheduled', 'in_progress', 'completed'], default: 'scheduled' }, // Статус выполнения задачи
    created_at: { type: Date, default: Date.now }, // Дата создания задачи
    updated_at: { type: Date, default: Date.now } // Дата обновления задачи
});

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);