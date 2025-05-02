// Импорты
import { PaymentCheckout, PaymentSuccess } from "#handlers/Payments.js";

// Список экшенов
export default (telegram) => {
	// Оплата премиума
	PaymentCheckout(telegram);
	PaymentSuccess(telegram);
};