import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs'; // Importa a função hash

import { User, UserDocument } from './schemas/user.schema';
// Crie um DTO (Data Transfer Object) simples para a criação de usuários
import { CreateUserDto } from './dto/create-user.dto'; 

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // AQUI É O ERRO: Deve retornar UserDocument ou null
  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  // Usado pelo controlador para criar o primeiro usuário admin/teste
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.password, 10); // 10 é o salt rounds
    const createdUser = new this.userModel({
      username: createUserDto.username,
      password: hashedPassword,
    });
    return createdUser.save();
  }

 // TODO: Implementar findById, findAll, update, delete para o CRUD de gerenciamento
}