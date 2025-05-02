// Импорты
import mongoose from 'mongoose';

// Транзакция
const TransactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID пользователя
    tariff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tariff', required: true }, // ID тарифа
    status: { type: String, enum: ['in_progress', 'accepted', 'completed', 'expired', 'failed'], default: 'in_progress' }, // Статус транзраздачи
    message_id: { type: String, default: null }, // ID Сообщения
    created_at: { type: Date, default: Date.now }, // Дата создания транзраздачи
    updated_at: { type: Date, default: Date.now } // Дата обновления транзраздачи
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);