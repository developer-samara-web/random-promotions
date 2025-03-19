// Импорт стилей
import "@/components/ui/Page/Page.modules.css";

// Компонент
export default function Page({ children }) {
    return (
        <main className='page'>
            {children}
        </main>
    );
}