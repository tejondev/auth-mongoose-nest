import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStragey extends PassportStrategy(Strategy) {
  // ======================================================
  // 1. Default, first validates the token with the secret
  // ======================================================

  // 2. Other validations can be added here ===============

  // Add userId to the request object

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<string> {
    const { id } = payload;

    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new UnauthorizedException('Token not valid');

    return user._id.toString();
  }
}
