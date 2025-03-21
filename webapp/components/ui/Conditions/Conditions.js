// Импорт стилей
import "@/components/ui/Conditions/Conditions.modules.css";

// Импорт компонентов
import Icon from "@/components/ui/Icon/Icon";

// Компонент
export default function Conditions({ status }) {
    return (
        <div className="conditions">
            {status ? <Icon name="CheckBadgeIcon" className="size-12" /> : <Icon name="ExclamationCircleIcon" className="size-12" />}
            <div className="conditions-inner">
                <div className="conditions-title">Условия акции</div>
                <div className="conditions-rules">Подписаться на канал</div>
            </div>
        </div>
    );
}