// Импорты
import mongoose from 'mongoose';

// Задачи планировщика
const TariffSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 }, // Название тарифа
    amount: { type: Number, required: true, min: 0 }, // Цена тарифа
    duration: { type: Number, required: true, min: 1 }, // Продолжительность тарифа в днях
    created_at: { type: Date, default: Date.now }, // Дата создания задачи
    updated_at: { type: Date, default: Date.now } // Дата обновления задачи
});

export default mongoose.models.Tariff || mongoose.model('Tariff', TariffSchema);