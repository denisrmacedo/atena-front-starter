// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

//import { PrismaAdapter } from '@auth/prisma-adapter'

//import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

//import type { Adapter } from 'next-auth/adapters'

//const prisma = new PrismaClient()


export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma) as Adapter,

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  debug: true,
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {

        console.log('credentials', credentials)

        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */

        const { email, password } = credentials as { email: string; password: string }

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const response = await fetch(`http://localhost:3010/autenticacao`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chave: email,
              senha: password,
              horario: 'UTC+03',
            }),
          })

          const data = await response.json()

          if (response.status === 401) {
            throw new Error(JSON.stringify(data))
          }

          if (response.status === 200) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */
            data.user = {
              id: data.usuario.id,
              name: data.usuario.name,
              image: null,
            }

            return data
          }

          return null
        } catch (e: any) {
          throw new Error(e.message)
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })

    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */

    // async jwt({ token, user, account, profile, isNewUser }) {
    //   if (user) {
    //     token.id = user.id;
    //   }
    //   if (account) {
    //     token.accessToken = account.access_token;
    //   }
    //   return token;
    // },

    // async session({ session, token, user }) {
    //   session.user.id = token.id;
    //   session.accessToken = token.accessToken;
    //   return session;
    // },

    async jwt({ token, user }) {
      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        const autorizacao: any = user

        token.name = autorizacao.usuario.nome
        token.email = autorizacao.chave
        token.picture = autorizacao.usuario.imagem
        token.accessToken = autorizacao.token
      }

      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.name = token.name
        session.user.image = token.picture
        session.user.accessToken = token.accessToken
      }

      return session
    }
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata)
    },
    warn(code) {
      console.warn(code)
    },
    debug(code, metadata) {
      console.debug(code, metadata)
    }
  }
}
