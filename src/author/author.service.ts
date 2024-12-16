import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AuthorCreateInput){
    //validando se os campos obrigatorios estão nulos.
    if (!data.surname || !data.is_a_user || !data.completeName || !data.is_a_user){
      throw new HttpException ("Fill in all required fields", HttpStatus.BAD_REQUEST);
    }

    // ja cadastrado?
    if (data.completeName){
      const existingAuthor = await this.prisma.author.findFirst({where: {completeName: data.completeName},
      });
      
      if (existingAuthor){
        throw new HttpException ("This author is already registered", HttpStatus.BAD_REQUEST);
      }
    }
    // validando respostas sim ou nao para user.
    if (data.is_a_user !== 'yes' && data.is_a_user !== 'no') {
      throw new HttpException('Inform whether the author is a user with "yes" or "no"', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.author.create({data});
  }

  async findAll(){
    return await this.prisma.author.findMany();
  }

  async findOne(id: number) {
    const existingAuthor = await this.prisma.author.findUnique({where: {id}});
    
    if (!existingAuthor){
      throw new HttpException ("Author not found", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.author.findUnique({where: {id}});
  }

  async update(id: number, data: Prisma.AuthorUpdateInput){    
    const existingAuthor = await this.prisma.author.findUnique({where: {id}});

    if (!existingAuthor){
      throw new HttpException ("Author not found", HttpStatus.BAD_REQUEST);
    }
    // se encontrou, validar se os dados novos estão de acordo
    //validando se os campos obrigatorios estão nulos.
    if (!data.surname || !data.is_a_user || !data.completeName || !data.is_a_user){
      throw new HttpException ("Fill in all required fields", HttpStatus.BAD_REQUEST);
    }

    if (data.completeName) {
      const completeName =
        typeof data.completeName === 'string' ? data.completeName : undefined;
    
      if (completeName) {
        const duplicateAuthor = await this.prisma.author.findFirst({
          where: {
            completeName,
            NOT: { id },  
          },
        });
    
        if (duplicateAuthor) {
          throw new HttpException('This author is already registered', HttpStatus.BAD_REQUEST);
        }
      }
    }
    // validando respostas sim ou nao para user.
    if (data.is_a_user !== 'yes' && data.is_a_user !== 'no') {
      throw new HttpException('Inform whether the author is a user with "yes" or "no"', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.author.update({where: {id}, data});
  }
  
  async remove(id: number){
    const existingAuthor = await this.prisma.author.findUnique({where: {id}});

    if (!existingAuthor){
      throw new HttpException ("Author not found", HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.author.delete({where: {id}});
  }
}