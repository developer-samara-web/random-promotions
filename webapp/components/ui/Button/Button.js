"use client"

// Импорт стилей
import "@/components/ui/Button/Button.modules.css";

// Компонент
export default function Button({ title, type, event }) {
    return <button className="button" type={type} onClick={() => event}>{title}</button>;
}