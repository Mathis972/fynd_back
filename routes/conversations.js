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
    const {id} = req.params
  const users = await prisma.conversations.findMany(
  {
        where:{
          OR:[{
            fk_utilisateur1_id: parseInt(id)
          },
          {
            fk_utilisateur2_id: parseInt(id)
          }
          ]
    },
      include:{
        message:true,
        utilisateurs1:{
          select:{
            prenom:true,
            photo_utilisateur:{
              where : {
                est_photo_profil : true
              }
            }
          }
        },
        utilisateur2:{
          select:{
          prenom:true,
          photo_utilisateur:{
              where : {
                est_photo_profil : true
              }
            }
        }}
      }
  }
  )
  res.json(users)
})

module.exports = router
