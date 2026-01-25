import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController, CommentController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostController, CommentController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
