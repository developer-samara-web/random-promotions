# Базовый образ
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем проект
COPY . .

# Запуск приложения
CMD ["node", "index.js"]