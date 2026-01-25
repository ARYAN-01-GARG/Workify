import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PostService } from './post.service';
import { PostController, CommentController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PostController, CommentController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
