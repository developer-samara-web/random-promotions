# Базовый образ
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем код проекта
COPY . .

# Сборка webapp
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запуск приложения
CMD ["npm", "run", "start"]