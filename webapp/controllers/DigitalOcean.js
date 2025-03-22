// Загрузка файла на облако
export default async function uploadDigitalOcean(data) {
    try {
        const file = new FormData()
        file.append('file', data)

        const result = await fetch('/api/upload', { method: 'POST', body: file })
        return result.json()
    } catch (error) {
        console.error('Ошибка запроса:', error)
    }
}