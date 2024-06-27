# Используем официальный образ Python в качестве базового
FROM python:3.9-slim

# Устанавливаем зависимости для Certbot
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository universe \
    && apt-get update && apt-get install -y \
    certbot \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Копируем скрипт для получения сертификатов в контейнер
COPY get_certificates.sh /usr/local/bin/get_certificates.sh

# Делаем скрипт исполняемым
RUN chmod +x /usr/local/bin/get_certificates.sh

# Определяем точку входа для контейнера
ENTRYPOINT ["/usr/local/bin/get_certificates.sh"]
