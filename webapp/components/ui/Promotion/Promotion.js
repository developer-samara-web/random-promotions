// Импорт стилей
import "@/components/ui/Promotion/Promotion.modules.css";

// Импорт компонентов
import Image from "next/image";

// Компонент
export default function Promotion({ name, description }) {
    return (
        <section className="promotion items-start">
            <Image className="promotion-image" src="/preloader.gif" width={50} height={50} alt={name}/>
            <div className="promotion-content gap-1">
                <div className="promotion-title">{name}</div>
                <div className="promotion-description">{description}</div>
            </div>
        </section>
    );
}