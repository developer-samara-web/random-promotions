// Виджет оплаты подписки
export default async function CloudPayments(user, tariff, transaction) {
    // Создаём экземпляр виджета
    const widget = new cp.CloudPayments();

    // Рекуррентные платежи
    const data = {
        CloudPayments: {
            recurrent: {
                interval: 'Month',
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
            data
        },
        (options) => {
            // При успешной оплате
            console.log('Успешная оплата', options)
        },
        (reason, options) => {
            // При ошибке
            console.log('Успешная оплата', options, reason)
        }
    );
};