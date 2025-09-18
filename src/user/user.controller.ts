import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwTGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import type { User } from '@prisma/client';

@UseGuards(JwTGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    console.log("user :",user);
    return user; // return user payload instead of static string
  }
}
