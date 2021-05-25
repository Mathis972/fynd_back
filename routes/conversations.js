const express = require('express')
const router = express.Router()
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  if (req.query.user_id) {
    const user_id = parseInt(req.query.user_id)
    const conversations = await prisma.conversations.findMany({
      include: {
        utilisateurs1: true, utilisateur2: true
      },
      where: {
        OR: [
          {
            fk_utilisateur2_id: user_id
          },
          {
            fk_utilisateur1_id: user_id
          }
        ]
      }
    })
    return res.json(conversations)
  }
  const conversations = await prisma.conversations.findMany()
  res.json(conversations)
})

module.exports = router
