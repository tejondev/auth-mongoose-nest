import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // CREATE =============================================================
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      let user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      user = user.toObject();
      delete user.password;
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // FIND ALL ============================================================
  findAll() {
    return this.userModel.find().select(['-__v']);
  }

  // FIND BY ID OR EMAIL =================================================
  async findOne(query: string) {
    let user: User;

    // Find by ID
    if (isValidObjectId(query)) {
      user = await this.userModel.findById(query);
    }

    // Find by Email
    if (!user) {
      user = await this.userModel.findOne({ email: query.toLowerCase() });
    }

    if (!user) throw new NotFoundException(`User "${query}" not found`);

    return user;
  }

  // UPDATE ==============================================================
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Find user
    const user = await this.findOne(id);

    // Save the updated user
    try {
      await user.updateOne(updateUserDto);
    } catch (error) {
      this.handleExceptions(error);
    }

    return {
      ...user.toJSON(),
      ...updateUserDto,
    };
  }

  // ERRORS ==============================================================
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Value already exists ${JSON.stringify(error.keyValue)}`,
      );
    }

    throw new InternalServerErrorException(error);
  }
}
