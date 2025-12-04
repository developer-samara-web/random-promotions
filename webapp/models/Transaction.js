// Импорты
import mongoose from 'mongoose';

// Транзакция
const TransactionSchema = new mongoose.Schema({
	telegram_id: { type: Number, required: true }, // ID пользователя
	subscription_id: { type: Number, required: true }, // ID подписки
	price: { type: Number, required: true }, // Цена
	period: { type: String, enum: ['monthly', 'weekly'], required: true } // Период
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);