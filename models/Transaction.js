// Импорты
import mongoose from 'mongoose';

// Задачи планировщика
const TransactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID пользователя
    tariff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tariff', required: true }, // ID тарифа
    status: { type: String, enum: ['in_progress', 'completed', 'expired'], default: 'in_progress' }, // Статус транзакции
    created_at: { type: Date, default: Date.now }, // Дата создания транзакции
    updated_at: { type: Date, default: Date.now } // Дата обновления транзакции
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);