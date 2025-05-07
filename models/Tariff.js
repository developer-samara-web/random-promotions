// Импорты
import mongoose from 'mongoose';

// Тариф
const TariffSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 }, // Название тарифа
    initial_amount: { type: Number, required: true, min: 0 },
    recurring_amount: { type: Number, required: true, min: 0 }, // Сумма последующих платежей
    duration: { type: Number, required: true }, // Продолжительность тарифа
    interval: { type: String, required: true }, // Интервал строка
    initial_day: { type: Number, required: true }, // Временная подписка
    rules: { type: String }, // Правила тарифа
    created_at: { type: Date, default: Date.now }, // Дата создания задачи
    updated_at: { type: Date, default: Date.now } // Дата обновления задачи
});

TariffSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.Tariff || mongoose.model('Tariff', TariffSchema);