const express = require('express')
const router = express.Router()
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  if (req.query.user_id) {
    const user_id = parseInt(req.query.user_id)
    const conversations = await prisma.conversations.findMany({
      include: {
        utilisateurs1: true, utilisateur2: true
      },
      where: {
        OR: [
          {
            fk_utilisateur2_id: user_id
          },
          {
            fk_utilisateur1_id: user_id
          }
        ]
      }
    })
    return res.json(conversations)
  }
  const conversations = await prisma.conversations.findMany()
  res.json(conversations)
})
router.get('/utilisateur/:id', async (req, res) => {
  const { id } = req.params
  try {
    const users = await prisma.conversations.findMany(
      {
        where: {
          OR: [{
            fk_utilisateur1_id: parseInt(id)
          },
          {
            fk_utilisateur2_id: parseInt(id)
          }
          ]
        },
        include: {
          message: true,
          utilisateurs1: {
            select: {
              prenom: true,
              photo_utilisateur: {
                where: {
                  est_photo_profil: true
                }
              }
            }
          },
          utilisateur2: {
            select: {
              prenom: true,
              photo_utilisateur: {
                where: {
                  est_photo_profil: true
                }
              }
            }
          }
        }
      }
    )
    res.json(users)
  } catch (error) {
    res.json(error)
  }

})
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.messages.deleteMany({
    where: {
      fk_conversation_id: parseInt(id)
    }
  })
  await prisma.conversations.delete({
    where: {
      id: parseInt(id)
    }
  });
  res.json(`Conversation d'id ${id} supprimée`)
})
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    est_enregistre
  } = req.body
  const conversation = await prisma.conversations.update({
    where: {
      id: parseInt(id)
    },
    data: {
      est_enregistre
    }
  });
  res.json(conversation)
})
router.post('/', async (req, res) => {
  let { fk_utilisateur1_id, fk_utilisateur2_id } = req.body
  const conversation = await prisma.conversations.create({
    data: {
      fk_utilisateur1_id,
      fk_utilisateur2_id,
      est_enregistre:false,
      ajout_utilisateurs1 :false,
      ajout_utilisateurs2: false,
      date_enregistre: null
    },
  });
  res.json(conversation)
})

module.exports = router
