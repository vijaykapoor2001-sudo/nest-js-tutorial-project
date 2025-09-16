import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

   async signup(dto: AuthDto) {
    const hash = await argon2.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // exclude hash
      const { hash: _removed, ...result } = user;
      return result;

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }


  // SIGNIN (for now just returns message)
  async signin(dto: AuthDto) {

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatches = await argon2.verify(user.hash, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    } 
    // exclude hash before returning
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
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
