import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // SIGNUP
  async signup(dto: AuthDto) {
    // hash password
    const hash = await argon2.hash(dto.password);
    try {
      // create user (exclude hash in response)
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        //delete user.hash;
        /*
        select: {
          id: true,
          email: true,
          createdAt: true, // add other safe fields if you want
        },
        */
      });

      return user;
    } catch (error) {
      if (error instanceof
        Prisma.PrismaClientKnownRequestError
      ) {
        // if error is because of duplicate email
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  // SIGNIN (for now just returns message)
  signin() {
    return { msg: 'I am signed in' };
  }

  // GET ALL USERS (safe fields only)
  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
