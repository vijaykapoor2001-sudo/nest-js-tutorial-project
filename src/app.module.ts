import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), 
    AuthModule,  BookmarkModule, PrismaModule],
  controllers: [UserController],
  providers: [AppService, UserService], 
})
export class AppModule {}
