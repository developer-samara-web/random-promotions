// Импорт стилей
import "@/components/ui/Switch/Switch.modules.css";

// Компонент
export default function Switch({ value, placeholder, onChange }) {
    const handleToggle = () => {
        onChange(!value); // Передаем новое значение в родительский компонент
    };

    return (
        <div className="form-switch">
            <label className="form-label">{placeholder}:</label>
            <div onClick={handleToggle} className={`toggle-switch ${value ? 'toggle-switch--active' : ''}`} >
                <div className="toggle-switch__thumb"></div>
            </div>
        </div>
    );
}