import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { JwTGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import type { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwTGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}  
  @Get('me')
  getMe(@GetUser() user: User) {
    console.log("user :",user);
    return user; // return user payload instead of static string
  }
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto,) {
    return this.userService.editUser(userId, dto);
  }
}


