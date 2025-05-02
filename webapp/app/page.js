// Импорт компонентов
import Home from "@/components/pages/home/Home";

// SEO
export const metadata = {
  title: "Mr.Раздачкин | Регистрация в раздачи",
  description: "https://t.me/mr_razdachkin",
};

// Компонент
export default async function HomePage({ searchParams }) {
  return <Home searchParams={await searchParams} />;
}