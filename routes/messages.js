const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  if (req.query.conversation_id) {
    const conversation_id = parseInt(req.query.conversation_id)
    const messages = await prisma.messages.findMany({
      where: {
        fk_conversation_id: conversation_id
      }
    })
    return res.json(messages)
  }
  const messages = await prisma.messages.findMany()
  res.json(messages)
})
router.post('/', async (req, res) => {
  console.log(req.body)
  let { send_by_user1, contenu, fk_conversation_id } = req.body
  const post = await prisma.messages.create({
    data: {
      send_by_user1,
      contenu,
      fk_conversation_id
    },
  })
  res.json(post)
})
module.exports = router
