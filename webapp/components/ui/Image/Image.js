"use client"

// Импорт стилей
import "@/components/ui/Image/Image.modules.css";

// Импорт компонентов
import { useState } from 'react'
import { motion } from 'framer-motion'

// Компонент
const Image = ({ url }) => {
    const [isZoomed, setIsZoomed] = useState(false)

    const toggleZoom = () => setIsZoomed((prev) => !prev)

    return (
        <motion.div
            className="image"
            onClick={toggleZoom}
            initial={{ maxHeight: 100, maxWidth: 1000 }}  // Начальные значения для анимации
            animate={{ maxHeight: isZoomed ? 1000 : 100, maxWidth: isZoomed ? 500 : 1000 }}  // Анимируем размеры
            transition={{ duration: 0.3 }}  // Плавность анимации
            style={{
                overflow: 'hidden',  // Скрываем то, что выходит за пределы
                display: 'flex',  // Flexbox для центрирования
                justifyContent: 'center',  // Горизонтальное центрирование
                alignItems: 'center'  // Вертикальное центрирование
            }}
        >
            <motion.img
                src={url}
                alt="thumbnail"
                style={{
                    width: '100%',  // Изображение занимает всю ширину контейнера
                    height: '100%', // Изображение занимает всю высоту контейнера
                    objectFit: 'cover'  // Сохраняем соотношение сторон изображения
                }}
                animate={{ scale: isZoomed ? 1 : 1 }}  // Анимация масштаба для добавления эффекта при уменьшении
                transition={{ duration: 0.3 }}  // Плавность анимации для изображения
            />
        </motion.div>
    )
}

export default Image