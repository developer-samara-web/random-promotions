// Импорты
import mongoose from 'mongoose';

// Участия в акциях
const ParticipantSchema = new mongoose.Schema({
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: true }, // ID Акции
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID Пользователя
    status: { type: String, enum: ['pending', 'winner', 'loser'], default: 'pending' }, // Статус участия в акции
    participation_date: { type: Date, default: Date.now }, // Дата записи на участие в акции
    win_date: { type: Date }, // Дата победы в акции
});

export default mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema);