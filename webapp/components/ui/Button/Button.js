"use client"

// Импорт стилей
import "@/components/ui/Button/Button.modules.css";

// Импорт компонентов
import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";

// Компонент
export default function Button({ name, type, icon, event, link }) {
    return (
        <>
            {link ? (
                <Link className="button" href={link}>
                    {icon && <Icon name={icon} className="size-5" />}
                    {name}
                </Link>
            ) : (
                <button className="button" type={type} onClick={() => event}>
                    {icon && <Icon name={icon} className="size-5" />}
                    {name}
                </button>
            )}
        </>
    );
}