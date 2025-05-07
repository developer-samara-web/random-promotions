// Импорт компонентов
import * as React from 'react'
import PaymentView from "@/components/pages/payment/PaymentView";

// SEO
export const metadata = {
	title: `Mr.Раздачкин | Оплата "Премиум"`,
	description: "https://t.me/mr_razdachkin",
};

// Компонент
export default function PaymentViewPage({ params }) {
	const { id } = React.use(params);

	return <PaymentView transactionId={id} />
}