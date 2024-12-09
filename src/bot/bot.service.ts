import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;
  private chatId: number | null = null; // Сохраним ID чата, инициализирован для проверки

  constructor(private configService: ConfigService) {
    // Инициализация бота в конструкторе
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(botToken);

    // Обработчик команды /start
    this.bot.start((ctx) => {
      this.chatId = ctx.chat.id; // Сохраняем chatId пользователя
      this.sendWelcomeMessage(ctx);      
    });

  }

  // Метод запускается при инициализации модуля
  onModuleInit() {
    // Запуск бота
    this.bot.launch().then(() => {
      console.log('Bot started');
    });

   }

  // Отправка приветственного сообщения
  private sendWelcomeMessage(ctx) {
    ctx.replyWithPhoto(
      { url: 'https://trashbox.ru/ifiles/1764677_dfe1c3_0-2.jpg_min1x2/v-buduschem-roboty-budut-gibkimi-kak-osminogi-pervye-shagi-uzhe-sdelany-3.jpg' },
      {
        caption: 'Заказы РОБОБАГ',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Играть в один клик', url: 't.me/Tajstoxbot/tajstox' }],
            [{ text: 'Подписаться на канал', callback_data: 'button2' }],
            [{ text: 'Как заработать на игре', callback_data: 'button3' }],
          ],
        },
      },
    );
  }

  // Отправка периодического сообщения
  public sendPeriodicMessage(telegramMessage: string) {
    // Проверяем наличие chatId перед отправкой
    if (this.chatId) {
      this.bot.telegram.sendMessage(this.chatId, telegramMessage);
    }
  }
}
