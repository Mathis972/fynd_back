const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function create_reponses_utilisateurs (user_id, reponse_id) {
  const newReponse = await prisma.reponses_utilisateurs.create({
    data: {
      fk_utilisateur_id: user_id,
      fk_reponse_id: reponse_id
    }
  })
  console.log('crée')
}

router.get('/', async (req, res) => {
  if (req.query.user_id) {
    const user_id = parseInt(req.query.user_id)
    const resp_users = await prisma.reponses_utilisateurs.findMany({
      include: {
        reponse: {
          include: {
            question: true
          }
        }
      },
      where: {
        fk_utilisateur_id: user_id
      }
    })
    return res.json(resp_users)
  }
  const users = await prisma.reponses_utilisateurs.findMany()
  res.json(users)
})

router.post('/', async (req, res) => {
  const reponses = req.body.reponses_utilisateur
  const id = req.body.id
  reponses.forEach(reponse => {
    console.log(reponse)
    if (reponse) {
      create_reponses_utilisateurs(id, reponse)
      console.log(reponse)
    }
  });
  res.json('fait')
});

module.exports = router
