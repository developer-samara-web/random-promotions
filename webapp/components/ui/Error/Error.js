// Импорт стилей
import "@/components/ui/Error/Error.modules.css";

// Импорт компонентов
import Icon from "@/components/ui/Icon/Icon";

// Компонент
export default function Error({ title, description }) {
    return (
        <div className="error">
            <div className="error-content">
                <div className="error-title">{title}</div>
                <div className="error-badge">
                    <Icon name="ExclamationCircleIcon" className="size-4" />
                    <span>ERROR</span>
                </div>
            </div>
            <div className="error-description ">{description}</div>
        </div>
    );
}