import { User } from '@prisma/client'; // Импортируйте модель User из вашего проекта

declare module 'express' {
  export interface Request {
    user?: User; // Добавляем свойство user к интерфейсу Request
  }
}
