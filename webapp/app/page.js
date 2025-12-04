// Импорт компонентов
import Home from "@/components/pages/home/Home";

// SEO
export const metadata = {
  title: "Гарсем рулетка | Регистрация в раздачи",
  description: "https://t.me/Majestic_Ryletka",
};

// Компонент
export default async function HomePage({ searchParams }) {
  return <Home searchParams={await searchParams} />;
}