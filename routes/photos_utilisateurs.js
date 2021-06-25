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

router.post('/', async (req, res) => {
const params = req.body
if (!req.files)
    return res.status(422).json('vous n\'avez pas mis de photo')
  const file = req.files.image
  const file_name = new Date().getTime() + '_' + file.name
  params.image = `image/${file_name}`
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
    file.mv('public/image/' + file_name, async (err) => {
      if (err)
        return res.status(500).json(err)
        const question = await prisma.photos_utilisateurs.create({
          data: {
            photo_url: params.image,
            fk_utilisateur_id: parseInt(params.fk_utilisateur_id),
            est_photo_profil:  JSON.parse(params.est_photo_profil)
          }
        })
        res.json(question)

    })
  } else {
    return res.status(500).json('pas le bon format')
  }
})
module.exports = router
