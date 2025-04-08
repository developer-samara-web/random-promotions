// Импорт компонентов
import Tariffs from "@/components/pages/tariffs/Tariffs";

// SEO
export const metadata = {
  title: "Mr.Раздачкин | Настройка тарифов",
  description: "https://t.me/mr_razdachkin",
};

// Компонент
export default async function TariffsPage() {
  return <Tariffs />;
}