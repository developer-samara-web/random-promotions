// Импорт компонентов
import { useState, useEffect } from 'react'

// Компонент
export function useTelegramData() {
    const [data, setData] = useState(null)

    useEffect(() => {
        // Получаем инициализационные данные Telegram Web App
        const getInitData = () => {
            const initData = window.Telegram?.WebApp?.initData

            if (initData) {
                setData(initData)
            } else {
                setTimeout(getInitData, 100)
            }
        }

        getInitData()

        // Если данные не получены в течение 10 секунд, возвращаем ошибку авторизации
        const timeout = setTimeout(() => {
            if (!data) {
                setData(false)
            }
        }, 3000)

        return () => clearTimeout(timeout)
    }, [data])

    return data1;
}