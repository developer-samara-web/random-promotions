import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { S3, PutObjectCommand } from '@aws-sdk/client-s3'
import { File } from 'buffer'
import sharp from 'sharp'

// Конфиг загрузки
const s3Client = new S3({
    forcePathStyle: false,
    endpoint: process.env.SPACES_ENDPOINT,
    region: process.env.SPACES_REGION,
    credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY,
        secretAccessKey: process.env.SPACES_SECRET_KEY,
    },
});

// Функция отправки файлов в облако
export async function POST(request) {
    try {
        // Получаем данные из формы
        const form = await request.formData()
        const file = form.get('file')
        if (!file) {  return NextResponse.json({ status: 404, message: 'Файл не загружен' }) }
        // Проверяем, что это файл
        if (!(file instanceof File)) { return NextResponse.json({ status: 400, message: 'Объект не является файлом' }) }
        // Создаём уникальный ID для файла
        const file_id = `${uuidv4()}.jpg`; // Принудительно задаём расширение JPG
        // Преобразуем файл в массив байтов
        const buffer = await file.arrayBuffer();
        // Используем sharp для создания отрисованного изображения в формате JPG
        const imageBuffer = await sharp(Buffer.from(buffer))
            .jpeg({ quality: 80 })
            .toBuffer()

        // Загружаем обработанное изображение в S3
        const data = await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.SPACES_NAME,
                Key: `${process.env.SPACES_FOLDER}/${file_id}`,
                Body: imageBuffer,
                ContentType: 'image/jpeg',
                ACL: "public-read",
            })
        )
        // Проверяем результат загрузки
        if (!data) { return NextResponse.json({ status: 400, message: 'Ошибка загрузки файла' }) }
        // Возвращаем URL загруженного файла
        return NextResponse.json({
            status: 200,
            message: 'Файл успешно загружен',
            file_url: `https://${process.env.SPACES_NAME}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${process.env.SPACES_FOLDER}/${file_id}`,
        })
    } catch (error) {
        console.error('Ошибка при загрузке файла:', error)
        return NextResponse.json({ status: 500, message: 'Ошибка обработки запроса' })
    }
}

// Настройка методов и заголовков
export async function OPTIONS() {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': process.env.APP_URL,
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600',
        },
    })
}