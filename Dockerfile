
# Используем официальный образ Node.js в качестве базового 
FROM node:20-alpine 

# # Устанавливаем необходимые пакеты: Python и библиотеки для построения "canvas"
# RUN apk add --no-cache python3 make g++ 

# Устанавливаем рабочую директорию 
WORKDIR /usr/src/app 

# Копируем package.json и package-lock.json 
COPY package*.json ./ 

# Устанавливаем зависимости 
RUN npm install 

# Копируем остальные файлы приложения в контейнер 
COPY . . 

# Компилируем приложение 
# RUN npm install prisma --save-dev

RUN npm run build 

# Открываем порт, который будет использовать ваше приложение 
EXPOSE 8085 

# Устанавливаем переменную окружения для NODE_ENV 
ENV NODE_ENV=production 

# Запускаем приложение 
CMD ["node", "dist/main"]