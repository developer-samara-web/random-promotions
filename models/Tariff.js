// Импорты
import mongoose from 'mongoose';

// Тариф
const TariffSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 }, // Название тарифа
    type: { type: String, enum: ['regular', 'promo'], default: 'regular', required: true }, // Тип акции
    main_menu: { type: Boolean, default: false }, // Показываем в главном меню
    initial_amount: { type: Number, required: true, min: 0, default: 0 }, // Начальная сумма платежа
    recurring_amount: { type: Number, required: true, min: 0 }, // Сумма последующих платежей
    duration: { type: String, enum: ['Day', 'Week', 'Month'], required: true }, // Продолжительность тарифа
    created_at: { type: Date, default: Date.now }, // Дата создания задачи
    updated_at: { type: Date, default: Date.now } // Дата обновления задачи
});

TariffSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.Tariff || mongoose.model('Tariff', TariffSchema);