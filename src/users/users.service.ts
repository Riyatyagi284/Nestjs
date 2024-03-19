import { Inject, Injectable } from '@nestjs/common';
import { userTypes } from 'src/shared/schema/users';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import config from 'config';
import { userRepository } from 'src/shared/repositories/user.repository';
import {
  comparePassword,
  generatedHashPassword,
} from 'src/shared/utility/password-manager';
import { sendEmail } from 'src/shared/utility/mail-handler';
// import { generateAuthToken } from 'src/shared/utility/token-generator';

@Injectable()
export class UsersService {

  constructor(
    @Inject(userRepository) private readonly userDB: userRepository,
  ) { }


  async create(createUserDto: CreateUserDto) {
    try {
      // hashed the password here
      createUserDto.password = await generatedHashPassword(createUserDto.password,);
      // check wheather it is an admin
      if (
        createUserDto.type === userTypes.ADMIN && createUserDto.secretToken !== config.get('adminSecretToken')) {
        throw new Error('Not allowed to create admin');
      } else if (createUserDto.type !== userTypes.CUSTOMER) {
        createUserDto.isVerified = true;
      }
      // check if user is already exists
      const user = await this.userDB.findOne({
        email: createUserDto.email,
      });
      if (user) {
        throw new Error('User already exist!!')
      }
      // generate opt
      const otp = Math.floor(Math.random() * 900000) + 100000;

      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      // create new user in db

      const newUser = await this.userDB.create({
        ...createUserDto,
        otp,
        otpExpiryTime,
      })

      if(newUser.type !== userTypes.ADMIN){
        sendEmail()
      }


    } catch (error) {

    }
  }

  async findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
