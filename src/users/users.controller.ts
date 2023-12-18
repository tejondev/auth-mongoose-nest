import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SameUserChangesGuard } from 'src/common/guards/same-user-changes.guard';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create and delete users are handled by the auth module
  // Change password is handled by the auth module
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':idOrEmail')
  findOne(@Param('idOrEmail') idOrEmail: string) {
    return this.usersService.findOne(idOrEmail);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard(), SameUserChangesGuard)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
