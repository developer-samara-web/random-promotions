// Импорт стилей
import "@/components/ui/Preloader/Preloader.modules.css";

// Компонент
export default function Preloader({ title }) {
    return (
        <div className="preloader w-full">
            <div className="preloader_spinner"></div>
            <div className="preloader_content"> {title ? title : 'Загружаю данные'}</div>
        </div>
    )
}