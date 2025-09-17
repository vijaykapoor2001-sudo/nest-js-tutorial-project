import { Injectable } from '@nestjs/common';
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
    //console.log('JWT payload:', payload);
    delete user.hash; // remove hash before attaching to req.user
    return user; // attaches to req.user
  }
}
