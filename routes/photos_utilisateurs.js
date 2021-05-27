const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const users = await prisma.photos_utilisateurs.findMany()
  res.json(users)
})

router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params

  const photos_utilisateurs = await prisma.photos_utilisateurs.deleteMany({
    where: {
      fk_utilisateur_id: parseInt(user_id)
    }
  })
  console.log(photos_utilisateurs)
  res.json(`les photos de l'utilisateur ${user_id} sont supprimées`)
})

module.exports = router
