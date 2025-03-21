// Импорт компонентов
import * as Icons from '@heroicons/react/24/solid';

// Компонент
export default function Icon ({ name, className = '' }) {
    // Получаем компонент по имени и проверяем, существует ли иконка
    const Component = Icons[name];
    if (!Component) return null;

    // Возвращаем компонент с применением классов стилей
    return <Component className={className} />
}