// users.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Project, User } from '../entities';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: MongoRepository<User>,
    @InjectRepository(Project)
    private projectRepo: MongoRepository<Project>,
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

  async findById(userId: string) {
    const id = new ObjectId(userId);
    const user = this.userRepo.findOne({ where: { _id: id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
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
      const user = await this.findByMail(email);
      await this.projectRepo.delete({ userId: user?._id });
      await this.userRepo.delete({ email });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting User by mail: at userService',
      );
    }
  }

  async updateUserById(id: string, updatedUser: Partial<User>) {
    const user = await this.userRepo.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      if (updatedUser.name !== undefined) {
        user.name = updatedUser.name;
      }

      if (updatedUser.password !== undefined) {
        user.password = updatedUser.password;
      }

      if (updatedUser.urls) {
        user.urls = updatedUser.urls.filter((_, ind) => ind <= 4);
      }

      await this.userRepo.updateOne({ _id: new ObjectId(id) }, { $set: user });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error updating User by id: at userService',
      );
    }
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comparison = await bcrypt.compare(currentPassword, user?.password);
    console.log(comparison);
    if (!comparison) {
      throw new BadRequestException('Current Password does not match');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);
    user.password = hashedPass;
    console.log(user);
    return this.updateUserById(id, user);
  }
}
