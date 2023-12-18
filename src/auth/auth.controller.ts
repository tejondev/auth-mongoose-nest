import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SameUserChangesGuard } from '../common/guards/same-user-changes.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('change-password/:id')
  @UseGuards(AuthGuard(), SameUserChangesGuard)
  changePassword(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() password: ChangePasswordDto,
  ) {
    return this.authService.changePassword(id, password);
  }

  @Delete('delete-user/:id')
  @UseGuards(AuthGuard(), SameUserChangesGuard)
  deleteAccount(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.deleteAccount(id);
  }

  @Get('test/:id')
  @UseGuards(AuthGuard(), SameUserChangesGuard)
  test(@Param('id') id: string, @Req() req: Express.Request) {
    return { test: 'test', id, userReqInfo: req.user };
  }
}
