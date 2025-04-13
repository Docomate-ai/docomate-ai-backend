// users.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../entities';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: MongoRepository<User>,
  ) {}

  async createUser(userData: Partial<User>) {
    try {
      const user = this.userRepo.create(userData);
      return await this.userRepo.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating User: at userService',
      );
    }
  }

  async findByMail(email: string) {
    try {
      return await this.userRepo.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error finding User by mail: at userService',
      );
    }
  }

  async deleteByMail(email: string) {
    try {
      await this.userRepo.delete({ email });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting User by mail: at userService',
      );
    }
  }

  async updateUserById(id: string, updatedUser: Partial<User>) {
    try {
      const user = await this.userRepo.findOne({
        where: { _id: new ObjectId(id) },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updatedUser.name !== undefined) {
        user.name = updatedUser.name;
      }

      if (updatedUser.password !== undefined) {
        user.password = updatedUser.password;
      }

      await this.userRepo.updateOne({ _id: new ObjectId(id) }, { $set: user });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating User by id: at userService',
      );
    }
  }
}
