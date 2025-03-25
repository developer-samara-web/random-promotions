// Импорт стилей
import "@/components/ui/Block/Block.modules.css"

// Компонент
export default function Block({ children, className }) {
    return (
        <div className="block">
            <div className={`block-inner ${className}`}>
                {children}
            </div>
        </div>
    );
}