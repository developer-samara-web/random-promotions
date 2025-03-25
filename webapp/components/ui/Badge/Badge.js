// Импорт компонентов
import "@/components/ui/Badge/Badge.modules.css";

//  Компонент
export default function Badge({ status, content, className }) {
    return (
        <div className={`badge ${status ? 'badge-success' : 'badge-error'} ${className} `}>{content}</div>
    )
}