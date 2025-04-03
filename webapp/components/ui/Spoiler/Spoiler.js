// Импорт стилей
import '@/components/ui/Spoiler/Spoiler.modules.css';

// Импорт компонентов
import { useState } from 'react'
import Icon from '@/components/ui/Icon/Icon';

// Блок информации
const Info = ({ children, title, toggle, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleInfo = () => setIsOpen(!isOpen);

    return (
        <div className={`info info--default ${className}`}>
            <div className="info__header">
                <div className={`info__title info__title--default`}>{title}</div>
                <button onClick={toggleInfo} className="info__toggle">
                    <Icon name={isOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} className='size-4' />
                </button>
            </div>
            <div className={`info__content ${toggle ? (isOpen ? 'info__content--open' : 'info__content--closed') : 'info__content--open'}`}>
                <div className='mt-4'>{children}</div>
            </div>
        </div>
    );
};

export default Info;