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
      },
    })
    return res.json(messages)
  }
  const messages = await prisma.messages.findMany({
    include :{
      conversation:{
        select:{
          fk_utilisateur1_id:true,
          fk_utilisateur2_id:true
        }
      }
    }
  })
  res.json(messages)
})
router.get('/:id', async (req, res) => {
  const {id} = req.params
  const users = await prisma.messages.findUnique({
    include: {
      conversation:{
        select:{
          fk_utilisateur1_id:true,
          fk_utilisateur2_id:true
        } // Return all fields
    }
  },
    where:{
      id: parseInt(id)
    }
  })
  res.json(users)
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
    include: {
      conversation:{
        select:{
          fk_utilisateur1_id:true,
          fk_utilisateur2_id:true
        } // Return all fields
    }
  }
  })
  res.json(post)
})
module.exports = router
