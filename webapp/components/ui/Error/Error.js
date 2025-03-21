// Импорт стилей
import "@/components/ui/Error/Error.modules.css";

// Импорт компонентов
import Icon from "@/components/ui/Icon/Icon";

// Компонент
export default function Error({ title, description }) {
    return (
        <div className="error">
            <Icon name="ExclamationCircleIcon" className="size-12" />
            <div className="error-inner">
                <div className="error-title">{title}</div>
                <div className="error-description">{description}</div>
            </div>
        </div>
    );
}