"use client"

// Импорт стилей
import "@/components/ui/Button/Button.modules.css";

// Импорт компонентов
import Icon from "@/components/ui/Icon/Icon";

// Компонент
export default function Button({ name, type, icon, event }) {
    return (
        <button className="button" type={type} onClick={() => event}>
            {icon && <Icon name={icon} className="size-5" />}
            {name}
        </button>
    );
}