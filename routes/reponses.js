const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const reponses = await prisma.reponses.findMany()
  res.json(reponses)
})

router.post('/', async (req, res) => {
  const response = await prisma.reponses.create({
    data: {
      icon: req.body.icon,
      fk_question_id: req.body.fk_question_id,
      message_reponse: req.body.message_reponse
    }
  })
  res.json(response)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params

  const response = await prisma.reponses.update({
    where: {
      id: parseInt(id)
    },
    data: {
      message_reponse: req.body.message_reponse
    }
  })
  res.json(response)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const response = await prisma.reponses.delete({
    where: {
      id: parseInt(id)
    }
  })
  res.json(`réponse ${response.id} supprimée`)
})

module.exports = router
