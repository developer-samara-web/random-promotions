// Импорт компонентов
import Premium from "@/components/pages/premium/Premium";

// SEO
export const metadata = {
  title: "Mr.Раздачкин | Премиум подписка",
  description: "https://t.me/mr_razdachkin",
};

// Компонент
export default async function HomePage() {
  return <Premium />;
}