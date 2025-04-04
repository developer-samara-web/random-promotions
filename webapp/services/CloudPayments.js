import { delTransaction, updateTransaction } from "@/controllers/Transactions";
import { updateUser } from "@/controllers/Users";

// Виджет оплаты подписки
export default async function CloudPayments(user, tariff, transaction, setError, setSuccess) {
    // Создаём экземпляр виджета
    const widget = new cp.CloudPayments();

    // Рекуррентные платежи
    const data = {
        CloudPayments: {
            recurrent: {
                interval: tariff.duration,
                period: 1,
                // StartDate
            }
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
            skin: "modern",
            data
        },
        async (options) => {
            // При успехе показываем экран успеха
            setSuccess({ message: 'Спасибо за ваш платеж! ', options })
            // Устанавливаем премиум статус пользователю
            const updateUserData = await updateUser(user._id, {
                'subscription.is_active': true,
                'subscription.is_auto_renewal': true,
                'subscription.start_date': new Date(),
                'subscription.end_date': new Date()
            })

            if (updateUserData) {
                // Обновляем статус транзакции
                await updateTransaction(transaction._id, {
                    status: 'completed',
                    updated_at: new Date()
                })
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