// Импорты
import mongoose from 'mongoose';

// Участие в раздаче
const ParticipantSchema = new mongoose.Schema({
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: true }, // ID Раздачи
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID Пользователя
    status: { type: String, enum: ['pending', 'winner', 'loser'], default: 'pending' }, // Статус участия в раздачи
    participation_date: { type: Date, default: Date.now }, // Дата записи на участие в раздаче
    win_date: { type: Date }, // Дата победы в раздаче
});

export default mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema);