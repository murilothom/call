import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userTaken = await prisma.user.findUnique({
    where: {
      username,
    },
  })
  if (userTaken) {
    return res.status(409).json({ message: 'Username already taken' })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@call:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res.status(201).json(user)
}
