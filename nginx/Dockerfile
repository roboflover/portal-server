FROM nginx:alpine

RUN apk add --no-cache openssl

# Копировать конфигурацию Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
