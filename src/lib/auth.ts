import type { NextAuthOptions } from 'next-auth';
import { compare } from 'bcryptjs'; // used to compare hashed passwords
import CredentialsProvider from 'next-auth/providers/credentials'; //llows users to sign in using their email and password.
import { prisma } from './prisma'; //used to interact with your database

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt', //use JWT for session handling
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hoge@hoge.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        //verify if a user exists in our database
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        //f either of them is not defined, the function immediately returns null,
        //which indicates to NextAuth.js that the sign-in attempt is invalid.

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        //This statement uses Prisma's findUnique function to search for a user in the database
        //whose email matches the email provided in the credentials.

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }
        //This statement first checks if a user was found in the database.
        //If not, it returns null to indicate that the sign-in attempt is invalid.
        //If a user was found, it uses the compare function from bcryptjs to check
        //if the provided password matches the password in the database. If the passwords don't match, it also returns null.

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          randomKey: Math.random().toString(36).slice(-8),
        };
        // If the email and password are valid, the function returns an object
        //with the user's information. This information is then used by NextAuth.js
        //to create a session for the user.
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.user.id = token.sub;

      return session;
    },
  },
};

//authorize: The authorize function is responsible for validating the provided credentials.
//If the email and password match an entry in the database, it returns an object with the user's information; otherwise, it returns null to indicate that the credentials are invalid.
