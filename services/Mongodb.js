// Импорты
import mongoose from "mongoose";

// Глобальная кэшевая переменная
let cached = global.mongoose;
// Если нет кэшевой переменной
if (!cached) { cached = global.mongoose = { conn: null, promise: null } };
// Функция подключения к базе
export default async function connectToDatabase() {
	if (cached.conn) { return cached.conn }
	if (!cached.promise) {
		const opts = { bufferCommands: false };
		cached.promise = mongoose.connect(process.env.DB_URL, opts).then((mongoose) => { return mongoose });
	}
	cached.conn = await cached.promise;
	return cached.conn;
}