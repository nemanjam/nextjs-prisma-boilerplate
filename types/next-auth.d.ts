import 'next-auth';
import { User as UserModel } from '.prisma/client';

declare module 'next-auth' {
  interface User extends UserModel {}

  interface Session {
    user: User;
    expires: string;
  }
}
