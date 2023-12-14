import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    // usersService only used to create/register a new user
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // REGISTER =============================================================
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      ...user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  // LOGIN ================================================================
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Find user
    let user = await this.userModel.findOne({ email }).select('+password');

    if (!user) throw new UnauthorizedException('Credentials not valid');

    // Check password
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials not valid');

    user = user.toObject();
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  // GET JWT TOKEN ---------------------------------------------------------
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // CHANGE PASSWORD ======================================================
  async changePassword(id: string, { password }: ChangePasswordDto) {
    try {
      await this.userModel.updateOne(
        { _id: id },
        { password: bcrypt.hashSync(password, 10) },
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // DELETE ACCOUNT =======================================================
  async deleteAccount(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new NotFoundException(`User "${id}" not found`);
    }
  }
}
