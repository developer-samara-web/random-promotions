// Импорты
import { updateTransaction } from "@/controllers/Transactions";
import { getSubscribe } from "@/controllers/Subscribes";
import formatDate from "@/utils/formatDate";

// Виджет оплаты подписки
export default async function CloudPayments(user, tariff, transaction, setError, setSuccess) {
	// Создаём экземпляр виджета
	const widget = new cp.CloudPayments();

	// Определяем параметры рекуррентного платежа в зависимости от тарифа
	let recurrentData = {
		interval: tariff.interval,
		period: tariff.period
	};

	// Особые условия для акционного тарифа
	if (tariff.initial_amount) {
		recurrentData = {
			interval: tariff.interval,
			period: tariff.period,
			Amount: tariff.recurring_amount, // Следующий платеж
			StartDate: tariff.initial_day ? new Date(Date.now() + Number(tariff.initial_day) * 24 * 60 * 60 * 1000) : new Date(Date.now())
		};
	}

	const data = {
		CloudPayments: {
			recurrent: recurrentData
		}
	};

	// Общая информация о платеже
	widget.charge(
		{
			publicId: process.env.NEXT_PUBLIC_CLOUDPAYMENTS_SITE_ID,
			description: tariff.name,
			amount: tariff.initial_amount || tariff.recurring_amount,
			currency: 'RUB',
			invoiceId: transaction._id,
			accountId: user._id,
			autoClose: 3,
			skin: "modern",
			configuration: {
                common: {
                    successRedirectUrl: `${process.env.NEXT_PUBLIC_URL}/payment/view/${transaction._id}`,
                    failRedirectUrl: `${process.env.NEXT_PUBLIC_URL}/payment/view/${transaction._id}`
                }
            },
			data
		},
		async (options) => {
			// Получаем данные о подписке
			const { response: subscribeData } = await getSubscribe(user._id);
			// Сообщение об успехе
			setSuccess({ message: `Теперь вам доступны все функции нашего бота.\nВаша премиум-подписка активирована до: ${formatDate(subscribeData.Model[0].NextTransactionDateIso)}` })
			// Обновление транзакции
			await updateTransaction(transaction._id, {
				status: 'completed',
				updated_at: new Date()
			})
		},
		async (reason, options) => {
			// Сообщение об ошибке
			setError({ message: 'К сожалению, произошла ошибка при обработке платежа.\nПричина: [Недостаточно средств / Ошибка банка / Неверные данные карты / Технический сбой]' });
			// Обновление транзакции
			await updateTransaction(transaction._id, {
				status: 'expired',
				updated_at: new Date()
			})
		}
	);
};