const express=require('express')
const router=express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function create_reponses_utilisateurs(user_id, reponse_id) {
  const newReponse = await prisma.reponses_utilisateurs.create({
    data: {
      fk_utilisateur_id : user_id,
      fk_reponse_id : reponse_id
    }
  })
  console.log('crée')
}

router.get('/', async (req, res) => {
  const users = await prisma.reponses_utilisateurs.findMany()
  res.json(users)
})

router.post('/', async (req, res) => {
  const reponses = req.body.reponses_utilisateur
  const id = req.body.id
  reponses.forEach(reponse => {
    if(reponse) {
      create_reponses_utilisateurs(id, reponse)
    }
  });
});

module.exports=router
