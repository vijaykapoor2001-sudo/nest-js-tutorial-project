import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET not configured'); // optional safety
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret, // ✅ now string
    });
  }

  //async validate(payload: { sub: number; email: string }) {
async validate(payload: {sub: number; email: string; }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    // handle the null case first
    if (!user) {
      throw new UnauthorizedException();
    }
    //console.log('JWT payload:', payload);
    const { hash, ...userWithoutHash } = user;

    return userWithoutHash; // this will be attached to req.user
  }
}
