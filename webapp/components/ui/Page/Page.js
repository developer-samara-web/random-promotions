// Импорт стилей
import "@/components/ui/Page/Page.modules.css";

// Компонент
export default function Page({ children, className }) {
    return (
        <main className={`page ${className}`}>
            {children}
        </main>
    );
}