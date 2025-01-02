import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { NewsModule } from './news/news.module';
import { CatalogModule } from './catalog/catalog.module';
import { ProductModule } from './product/product.module';
import { MailModule } from './mail/mail.module'; // Убедитесь, что путь и имя корректны
import { OrderPrint3dModule } from './order-print3d/order-print3d.module';
import { OrderCatalogModule } from './order-catalog/order-catalog.module';
// import { ReviewPrint3dModule } from './review-print3d/review-print3d.module';
import { BotModule } from './bot/bot.module';
import { TicketsModule } from './tickets/tickets.module';
import { OrderTicketModule } from './order-ticket/order-ticket.module';
import { Model3dModule } from './model3d/model3d.module';
import * as Joi from 'joi';

@Module({
  imports: [
    CatsModule,
    AuthModule,
    UsersModule,
    PostModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        FRONTEND_URL: Joi.string(),
      }),
      isGlobal: true, 
    }),
    ExhibitionModule,
    NewsModule,
    CatalogModule,
    ProductModule,
    MailModule,
    OrderPrint3dModule,
    OrderCatalogModule,
    BotModule,
    TicketsModule,
    OrderTicketModule,
    Model3dModule,
  ],
})
export class AppModule {}
