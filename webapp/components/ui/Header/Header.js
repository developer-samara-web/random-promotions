// Импорт стилей
import "@/components/ui/Header/Header.modules.css";

// Компонент
export default function Header({ title, description }) {
    return (
        <header className="header">
            <div className='header-title'>{title}</div>
            { description && <div className='header-description'>{description}</div> }
        </header>
    );
}