const express=require('express')
const router=express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const questions = await prisma.questions.findMany()
  res.json(questions)
})

module.exports=router
