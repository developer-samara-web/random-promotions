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

    return 'query_id=AAFoZj0DAAAAAGhmPQNqz0hU&user=%7B%22id%22%3A54355560%2C%22first_name%22%3A%22%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%91%D1%80%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22a1kashnya%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FR3zbjRH14J0rzz4kV_2th9BFEwfUqYUZwGmGxuroEIQ.svg%22%7D&auth_date=1742554899&signature=Fo1AzF0HKbzgwnohyIpZtX2ULj22bG-Gtmwh1Sc7G1XJS8Qi8TKpvGOEWpYBg5W8s0QrvhHUrx85vxhruL5pDw&hash=78593afee3309b0a80a3d4ebc030437aa46d283d643bf376ddc704a5fe3133d2';
}