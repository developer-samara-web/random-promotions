// Импорт компонентов
import * as React from 'react'
import Payment from "@/components/pages/payment/Payment";

// SEO
export const metadata = {
	title: `Mr.Раздачкин | Оплата "Премиум"`,
	description: "https://t.me/mr_razdachkin",
};

// Компонент
export default function PaymentPage({ params }) {
	const { id } = React.use(params);

	return <Payment tariffId={id} />
}