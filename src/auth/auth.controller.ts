import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginUserDto } from './dto/login-user.dto';

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
  changePassword(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() password: ChangePasswordDto,
  ) {
    return this.authService.changePassword(id, password);
  }

  @Delete('delete-user/:id')
  deleteAccount(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.deleteAccount(id);
  }
}
