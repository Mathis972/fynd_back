const express=require('express')
const router=express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const reponses = await prisma.reponses.findMany()
  res.json(reponses)
})

module.exports=router
