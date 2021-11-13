import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from '../../../lib/prisma'

// import FacebookProvider from 'next-auth/providers/facebook';
// import GoogleProvider from 'next-auth/providers/google';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    // find complete example
    Providers.Credentials({    
      name: 'Credentials',       
      credentials: {      
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "email@gmail.com" 
        },      
        password: {  
          label: "Password", 
          type: "password" 
        }    
      },    
      async authorize(credentials, req) {          
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        // check pass too 
        return user || null;
      }  
    }),
    Providers.Facebook({    
      clientId: process.env.FACEBOOK_CLIENT_ID,    
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET  
    }),
    Providers.Google({    
      clientId: process.env.GOOGLE_CLIENT_ID,    
      clientSecret: process.env.GOOGLE_CLIENT_SECRET  
    })
  ],
  session: {
    jwt: true, // needed for credentials
    maxAge: 1 * 60 * 60, // 1 hour
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
};
