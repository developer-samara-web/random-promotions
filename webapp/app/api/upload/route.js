// Импорты
import { NextResponse } from "next/server";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { File } from 'buffer'

// Конфиг загрузки
const s3Client = new S3({
	forcePathStyle: false,
	endpoint: process.env.SPACES_ENDPOINT,
	region: process.env.SPACES_REGION,
	credentials: {
		accessKeyId: process.env.SPACES_ACCESS_KEY,
		secretAccessKey: process.env.SPACES_SECRET_KEY,
	},
	requestTimeout: 60000,
});

// Маршрут "Загрузка файла"
export async function POST(request) {
	try {
		// Получаем данные
		const form = await request.formData()
		// Извлекаем файл из данных формы 
		const file = form.get('file')
		// Проверяем существование
		if (!file) { return NextResponse.json({ status: 404, error: 'Файл не загружен' }) }
		// Является ли загруженный объект экземпляром File
		const isFile = file instanceof File
		// Если объект не является файлом
		if (!isFile) { return NextResponse.json({ status: 400, error: 'Объект не является файлом' }) }
		// Преобразуем файл в массив байтов для загрузки
		const buffer = await file.arrayBuffer()
		// Создаём id файла
		const originalFilename = file.name || '';
		const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
		const file_id = `${uuidv4()}${extension}`
		// Загружаем файл
		const data = await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.SPACES_NAME,
				Key: `${process.env.SPACES_FOLDER}/${file_id}`,
				Body: Buffer.from(buffer),
				ACL: "public-read"
			})
		)
		// Проверяем результат загрузки
		if (!data) { return NextResponse.json({ status: 400, error: 'Ошибка загрузки файла' }) }
		// Возвращаем сообщение об успешной загрузке и URL загруженного файла
		return NextResponse.json({
			status: 200,
			message: 'Файл успешно загружен',
			file_url: `https://${process.env.SPACES_NAME}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${process.env.SPACES_FOLDER}/${file_id}`
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
			'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_URL || '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Max-Age': '3600',
		},
	});
}