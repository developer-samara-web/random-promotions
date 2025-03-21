// Импорт компонентов
import * as React from 'react'
import Edit from "@/components/pages/promotions/Edit";

// SEO
export const metadata = {
  title: "Mr.Раздачкин | Редактирование",
  description: "https://t.me/mr_razdachkin",
};

// Компонент
export default function EditPage({ params }) {
  const { id } = React.use(params);
  return <Edit id={id} />;
}