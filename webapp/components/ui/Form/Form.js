// Импорт стилей
import "@/components/ui/Form/Form.modules.css";

// Импорт компонентов
import Button from "@/components/ui/Button/Button";
import Switch from "@/components/ui/Switch/Switch";

// Компонент
export default function Form({ onSubmit, fields, buttonName, buttonIcon, formData, setFormData }) {
    // Обработка переключателя
    const handleSwitchChange = (newValue) => {
        setFormData((prev) => ({
            ...prev,
            subscribe: newValue,
        }));
    };

    // Обработка ввода данных
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Обработка отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            {fields?.map(({ id, name, placeholder, type, required, visible }) => (
                visible && (
                    <div key={id}>
                        {type === 'toogle' ? (
                            <Switch value={formData[name] || false} placeholder={placeholder} onChange={handleSwitchChange} />
                        ) : (
                            <input
                                className="form-input"
                                key={id}
                                type={type}
                                name={name}
                                value={formData[name] || ""}
                                onChange={handleChange}
                                required={required}
                                placeholder={placeholder}
                            />
                        )}
                    </div>
                )
            ))}
            <Button name={buttonName} icon={buttonIcon} />
        </form>
    );
}