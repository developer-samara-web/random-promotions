import { delTransaction, updateTransaction } from "@/controllers/Transactions";
import { getSubscribe } from "@/controllers/Subscribes";
import { updateUser } from "@/controllers/Users";

// Виджет оплаты подписки
export default async function CloudPayments(user, tariff, transaction, setError, setSuccess) {
    // Создаём экземпляр виджета
    const widget = new cp.CloudPayments();

    // Определяем параметры рекуррентного платежа в зависимости от тарифа
    let recurrentData = {
        interval: tariff.duration,
        period: 1
    };

    // Особые условия для акционного тарифа (1 рубль за 2 дня)
    if (tariff.amount === 1 && tariff.name.includes("Акция")) {
        recurrentData = {
            interval: tariff.duration,
            period: 1, // Через 2 дня
            Amount: 500, // Следующий платеж будет 500 рублей
            StartDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Через 2 дня
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
            amount: tariff.amount,
            currency: 'RUB',
            invoiceId: transaction._id,
            accountId: user._id,
            autoClose: 3,
            skin: "modern",
            data
        },
        async (options) => {
            // Получаем данные о подписке
            const { response: subscribeData } = await getSubscribe(user._id);

            if (subscribeData) {
                // Экран успеха
                setSuccess({ message: `Спасибо за ваш платеж!\nСумма: ${subscribeData.Model[0].Amount} ${subscribeData.Model[0].Currency}\nСледующий платёж: ${subscribeData.Model[0].NextTransactionDateIso}\nID транзакции: ${transaction._id}\nСпасибо, что выбрали наш сервис! Если у вас возникнут вопросы, обращайтесь в поддержку.` })

                // Время окончания подписки
                let endDate = new Date(subscribeData.Model[0].NextTransactionDateIso);

                // Для акционного тарифа устанавливаем срок действия 2 дня
                if (tariff.amount === 1 && tariff.name.includes("Акция")) {
                    endDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
                }

                // Устанавливаем премиум статус пользователю
                const updateUserData = await updateUser(user._id, {
                    'subscription.is_active': true,
                    'subscription.is_auto_renewal': true,
                    'subscription.start_date': subscribeData.Model[0].StartDateIso,
                    'subscription.end_date': endDate,
                    'subscription.id': subscribeData.Model[0].Id
                })

                if (updateUserData) {
                    // Обновляем статус транзакции
                    await updateTransaction(transaction._id, {
                        status: 'completed',
                        updated_at: new Date()
                    })
                }
            }
        },
        async (reason, options) => {
            // При ошибке показываем экран ошибки
            setError({ message: 'К сожалению, произошла ошибка при обработке платежа. Причина: [Недостаточно средств / Ошибка банка / Неверные данные карты / Технический сбой]', options, reason });
            // Удаляем транзакцию
            delTransaction(transaction._id);
        }
    );
};