const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const questions = await prisma.questions.findMany()
  res.json(questions)
})
router.post('/', async (req, res) => {
  const question = await prisma.questions.create({
    data: {
      message: req.body.message
    }
  })
  res.json(question)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params

  const question = await prisma.questions.update({
    where: {
      id: parseInt(id)
    },
    data: {
      message: req.body.message
    }
  })
  res.json(question)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  await prisma.reponses.deleteMany({
    where: {
      fk_question_id: parseInt(id)
    }
  })

  const question = await prisma.questions.delete({
    where: {
      id: parseInt(id)
    }
  })
  res.json(`question : ${question.id} supprimée`)
})

module.exports = router
