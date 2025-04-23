// Импорт компонентов
import Image from "next/image";
import Icon from "@/components/ui/Icon/Icon";
import Button from "@/components/ui/Button/Button";

// Компонент
export default function Limit({ name, description, icon, button, count, status }) {
    return (
        <div className='flex flex-col justify-between items-center border-[1px] border-[#3b82f64f] bg-[#3b82f630] rounded-xl w-full p-5 cursor-pointer gap-5'>
            <div className='flex flex-col items-center justify-center gap-3'>
                {icon && <Icon name={icon} className="size-16 text-yellow-400 w-30 px-1 rounded-xl" />}
                <div className='flex flex-col text-center gap-2'>
                    <div className='font-medium uppercase text-sm'>{name}</div>
                    <div className='text-sm text-slate-400'>Пользователи без премиум-подписки могут участвовать только в <span className="text-white">ДВУХ</span> раздачах в месяц</div>
                </div>
            </div>
            {!status && button && (<Button name={button.name} icon="PlayCircleIcon" className={button.style} link={button.link || null} event={button.onClick || null} />)}
        </div>
    )
}