// Импорт компонентов
import * as React from 'react'
import PaymentResult from "@/components/pages/payment/PaymentResult";

// SEO
export const metadata = {
    title: `Mr.Раздачкин | test "Премиум"`,
    description: "https://t.me/mr_razdachkin",
};

// Компонент
export default function PaymentPage({ params }) {
    const { transaction } = React.use(params);

    return <PaymentResult transactionId={transaction} />
}