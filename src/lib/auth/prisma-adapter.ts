import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { parseCookies, destroyCookie } from 'nookies'
import { NextApiRequest, NextApiResponse } from 'next'

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse,
): Adapter {
  return {
    async createUser(user) {
      const { '@call:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
        throw new Error('User ID not found on cookies')
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      })

      destroyCookie({ res }, '@call:userId', {
        path: '/',
      })

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email!,
        avatarUrl: updatedUser.avatarUrl!,
        emailVerified: null,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatarUrl: user.avatarUrl!,
        emailVerified: null,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        avatarUrl: user.avatarUrl!,
        emailVerified: null,
      }
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      return {
        id: account.user.id,
        name: account.user.name,
        username: account.user.username,
        email: account.user.email!,
        avatarUrl: account.user.avatarUrl!,
        emailVerified: null,
      }
    },

    async updateUser(user) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      })

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email!,
        avatarUrl: updatedUser.avatarUrl!,
        emailVerified: null,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          sessionState: account.session_state,
        },
      })
    },

    async createSession(session) {
      const createdSession = await prisma.session.create({
        data: {
          userId: session.userId,
          expires: session.expires,
          sessionToken: session.sessionToken,
        },
      })

      return {
        userId: createdSession.userId,
        expires: createdSession.expires,
        sessionToken: createdSession.sessionToken,
      }
    },

    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: {
          sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!session) {
        return null
      }

      return {
        user: {
          id: session.user.id,
          name: session.user.name,
          username: session.user.username,
          email: session.user.email!,
          avatarUrl: session.user.avatarUrl!,
          emailVerified: null,
        },
        session: {
          expires: session.expires,
          sessionToken: session.sessionToken,
          userId: session.userId,
        },
      }
    },

    async updateSession(session) {
      const updatedSession = await prisma.session.update({
        where: {
          sessionToken: session.sessionToken,
        },
        data: {
          userId: session.userId,
          expires: session.expires,
        },
      })

      return {
        sessionToken: updatedSession.sessionToken,
        expires: updatedSession.expires,
        userId: updatedSession.userId,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          sessionToken,
        },
      })
    },
  }
}
