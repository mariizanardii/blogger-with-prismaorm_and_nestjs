import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, CommentModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
