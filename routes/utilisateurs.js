const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// retrouver tous les  utilisateur
router.get('/', async (req, res) => {
  const users = await prisma.utilisateurs.findMany()
  res.json(users)
})
// retrouver un utilisateur selon l'id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const users = await prisma.utilisateurs.findUnique({
    where: {
      id: parseInt(id)
    }
  })
  res.json(users)
})
// supprimer un utilisateur selon l'id
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await prisma.liaisons_raisons_inscriptions.deleteMany({
    where: {
      fk_utilisateur_id: parseInt(id)
    }
  })
  await prisma.photos_utilisateurs.deleteMany({
    where: {
      fk_utilisateur_id: parseInt(id)
    }
  })
  const conversations = await prisma.conversations.findMany({
    where: {
      OR: [
        {
          fk_utilisateur2_id: parseInt(id)
        },
        {
          fk_utilisateur1_id: parseInt(id)
        }
      ]
    }
  })
  let conversation_ids = conversations.map((conversation) => conversation.id);
  conversation_ids.forEach(async (id) => {
    await prisma.messages.deleteMany({
      where: {
        fk_conversation_id: id
      }
    })
  })
  await prisma.conversations.deleteMany({
    where: {
      OR: [
        {
          fk_utilisateur2_id: parseInt(id)
        },
        {
          fk_utilisateur1_id: parseInt(id)
        }
      ]
    }
  })
  const users = await prisma.utilisateurs.delete({
    where: {
      id: parseInt(id)
    }
  })
  res.json(`l'utilisateurs ${users.prenom} est supprimé`)
})
// ajouter un utilisateur
router.post('/', async (req, res) => {
  console.log(req.body)
  let { prenom, email, mot_de_passe, date_de_naissance, biographie } = req.body
  date_de_naissance = new Date(date_de_naissance)
  const post = await prisma.utilisateurs.create({
    data: {
      prenom,
      email,
      mot_de_passe,
      date_de_naissance,
      biographie,
    },
  })
  res.json(post)
})
//modifier un utilisateur selon l'id
router.put('/:id', async (req, res) => {
  const { id } = req.params
  let { prenom, email, mot_de_passe, date_de_naissance, biographie } = req.body

  const post = await prisma.utilisateurs.update({
    where: { id: parseInt(id) },
    data: {
      prenom,
      email,
      mot_de_passe,
      date_de_naissance: new Date(date_de_naissance),
      biographie
    },
  })
  res.json(post)
})
module.exports = router
