const express=require('express')
const router=express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const users = await prisma.messages.findMany()
  res.json(users)
})
router.post('/', async (req, res) => {
  console.log(req.body)
  let { photo_url, fk_utilisateur_id, est_photo_profil } = req.body
  const post = await prisma.utilisateurs.create({
    data: {
      photo_url,
      fk_utilisateur_id,
      est_photo_profil
    },
  })
  res.json(post)
})
module.exports=router
