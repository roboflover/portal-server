import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
  } from '@nestjs/common';
  import { PostService } from './post.service';
  import { Post as PostModel } from '@prisma/client';
  
  @Controller('api')
  export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    findAll(): string {
      return 'This action returns all cats';
    }

    @Post('addPost')
    async createPost(
      @Body() postData: PostModel,
    ): Promise<PostModel> {
      return this.postService.createPost(postData);
    }
  
    @Delete(':id')
    async deletePost(@Param('id') id: string): Promise<PostModel> {
      return this.postService.deletePost({ id: Number(id) });
    }
  }
  