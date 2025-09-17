import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    // req.user comes from JwtStrategy.validate()
    console.log("user :",req.user);
    return req.user; // return user payload instead of static string
  }
}
