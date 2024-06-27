#!/bin/bash

# Получаем сертификаты с помощью Certbot
certbot certonly --standalone -d robobug.ru -d www.robobug.ru --non-interactive --agree-tos -m holorabbit@yandex.ru

# Копируем сертификаты в общую директорию (если нужно)
cp -r /etc/letsencrypt/live /shared/certificates
