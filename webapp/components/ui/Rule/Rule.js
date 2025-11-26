// Импорт компонентов
import Image from "next/image";
import Icon from "@/components/ui/Icon/Icon";
import Button from "@/components/ui/Button/Button";

// Компонент
export default function Rule({ name, description, image, icon, button, count, status }) {
    return (
        <div className='flex flex-row justify-between items-center border-[1px] border-[#3b82f64f] bg-[#3b82f630] rounded-xl w-full p-3 cursor-pointer'>
            <div className='flex flex-row items-center gap-3'>
                {image && <Image className='w-10 h-10 rounded-xl' src={image} width={200} height={200} alt={description} />}
                {/* {icon && <Image className='w-10 h-10 rounded-xl' src={image} width={200} height={200} alt={description} />} */}
                <div className='flex flex-col'>
                    <div className='font-medium uppercase text-sm'>{name}</div>
                    <div className='text-xs text-slate-400'>{description}</div>
                </div>
            </div>
            {status && <Icon name="CheckIcon" className="size-8 text-white bg-[#2b7fff] p-2 rounded-xl" />}
            {!status && button && (<Button name={button.name} className={button.style} link={button.link || null} event={button.onClick || null} />)}
            {!status && count && (<div className="border-[1px] border-[#f63b3b70] bg-[#ff2b2b54] rounded-xl px-3 py-2 text-xs font-medium"> {count} </div>)}
        </div>
    )
}