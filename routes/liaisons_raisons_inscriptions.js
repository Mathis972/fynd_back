const express=require('express')
const router=express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const users = await prisma.liaisons_raisons_inscriptions.findMany()
  res.json(users)
})
router.post('/', async (req, res) => {
  const users = await prisma.liaisons_raisons_inscriptions.findMany()
  res.json(users)
})


module.exports=router
