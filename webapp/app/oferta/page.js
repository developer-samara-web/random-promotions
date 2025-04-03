// Импорт компонентов
import Oferta from "@/components/pages/oferta/Oferta";

// SEO
export const metadata = {
  title: "Mr.Раздачкин | Публичка оферта",
  description: "https://t.me/mr_razdachkin",
};

// Компонент
export default async function OfertaPage() {
  return <Oferta />;
}