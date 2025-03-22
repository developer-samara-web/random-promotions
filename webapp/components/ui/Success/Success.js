// Импорт стилей
import "@/components/ui/Success/Success.modules.css";

// Импорт компонентов
import Icon from "@/components/ui/Icon/Icon";

// Компонент
export default function Success({ title, description }) {
    return (
        <div className="success">
            <div className="success-content">
                <div className="success-title">{title}</div>
                <div className="success-badge">
                    <Icon name="ExclamationCircleIcon" className="size-4" />
                    <span>SUCCESS</span>
                </div>
            </div>
            <div className="success-description">{description}</div>
        </div>
    );
}