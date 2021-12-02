import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    role: string;
    provider: string;
  }

  interface Session {
    user: User;
    expires: string;
  }
}
