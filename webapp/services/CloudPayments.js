// Виджет оплаты подписки
export default async function CloudPayments(user, tariff, transaction) {
    // Создаём экземпляр виджета
    const widget = new cp.CloudPayments();

    // Данные чека
    const receipt = {
        Items: [
            {
                label: tariff.name,
                price: tariff.amount,
                quantity: 1,
                amount: tariff.amount,
                vat: 0,
                method: 0,
                object: 0
            }
        ],
        taxationSystem: 0,
        isBso: false,
        amounts: { electronic: tariff.amount, advancePayment: 0, credit: 0, provision: 0 }
    };

    // Рекуррентные платежи
    const data = {
        CloudPayments: {
            CustomerReceipt: receipt,
            recurrent: {
                interval: 'Month',
                period: 1,
                customerReceipt: receipt
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