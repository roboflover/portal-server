 // src/exceptions/user-exists.exception.ts
 import { HttpException, HttpStatus } from '@nestjs/common';

 export class UserExistsException extends HttpException {
   constructor() {
     super('User with this email already exists', HttpStatus.BAD_REQUEST);
   }
 }