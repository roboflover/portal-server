import { Post, User } from '@prisma/client';

export interface PostWithAuthor extends Post {
    author: User;
}
