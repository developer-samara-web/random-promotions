// Импорты
import mongoose from 'mongoose';

// Задачи планировщика
const ScheduleSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID Пользователя
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }, // ID Акции
    tariff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tariff' }, // ID Тарифа
    type: { type: String, enum: ['subscription', 'promotion'] },
    start_date: { type: Date }, // Дата начала задачи
    end_date: { type: Date, required: true }, // Дата окончания задачи
    status: { type: String, enum: ['scheduled', 'in_progress', 'completed'], default: 'scheduled' }, // Статус выполнения задачи
    created_at: { type: Date, default: Date.now }, // Дата создания задачи
    updated_at: { type: Date, default: Date.now } // Дата обновления задачи
});

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);