import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthorModule } from '../author/author.module';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';


@Module({
  imports: [PrismaModule, UserModule, AuthorModule, PostModule, CommentModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
