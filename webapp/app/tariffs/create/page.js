// Импорт компонентов
import TariffsCreate from "@/components/pages/tariffs/TariffsCreate";

// SEO
export const metadata = {
  title: "Mr.Раздачкин | Создание тарифа",
  description: "https://t.me/mr_razdachkin",
};

// Компонент
export default async function TariffsCreatePage() {
  return <TariffsCreate />;
}