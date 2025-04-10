// Импорт компонентов
import * as React from 'react'
import PremiumRules from "@/components/pages/premium/PremiumRules";

// SEO
export const metadata = {
  title: "Mr.Раздачкин | Условия подписка",
  description: "https://t.me/mr_razdachkin",
};

// Компонент
export default function PremiumRulesPage({ params }) {
  const { tariff_id } = React.use(params);
  return <PremiumRules tariffId={tariff_id} />;
}