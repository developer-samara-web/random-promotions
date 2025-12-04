// Импорт компонентов
import * as React from 'react'
import Edit from "@/components/pages/promotions/PromotionsEdit";

// SEO
export const metadata = {
  title: "Гарсем рулетка | Редактирование",
  description: "https://t.me/Majestic_Ryletka",
};

// Компонент
export default function EditPage({ params }) {
  const { id } = React.use(params);
  return <Edit id={id} />;
}