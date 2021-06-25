const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwtUtils = require('../utils/jwt.utils')
const bcrypt = require('bcrypt')

//match
router.get('/match/:id', async (req, res) => {
   const { id } = req.params
  // if (req.query.test) {
  //   const resp = await prisma.reponses_utilisateurs.findMany({
  //     select: {
  //       fk_reponse_id: true
  //     },
  //     where: {
  //       fk_utilisateur_id: parseInt(id)
  //     }
  //   })
  //   const question_arr = resp.map(r => r.fk_reponse_id)
  //   // const matches = await prisma.reponses_utilisateurs.groupBy({
  //   //   by: ['fk_utilisateur_id'],
  //   //   where: {
  //   //     fk_reponse_id: { in: question_arr },
  //   //     fk_utilisateur_id: { not: parseInt(id) },
  //   //   },
  //   //   // include: {
  //   //   //   utilisateur: {
  //   //   //     include: {
  //   //   //       conversation: true,
  //   //   //       conversation2: true
  //   //   //     }
  //   //   //   }
  //   //   // },
  //   //   _count: {
  //   //     fk_utilisateur_id: true
  //   //   }
  //   // })
  //   const matches = await prisma.reponses_utilisateurs.findMany({
  //     where: {
  //       fk_reponse_id: { in: question_arr },
  //       fk_utilisateur_id: { not: parseInt(id) },
  //       // OR: [
  //       //   {
  //       //     AND: [
  //       //       conversations.fk_utilisateur1_id = fk_utilisateur_id,
  //       //       conversations.fk_utilisateur2_id = id,
  //       //     ]
  //       //   },
  //       //   {
  //       //     AND: [
  //       //       conversations2.fk_utilisateur1_id = id,
  //       //       conversations2.fk_utilisateur2_id = fk_utilisateur_id,
  //       //     ]
  //       //   }
  //       // ]
  //     },
  //     include: {
  //       utilisateur: {
  //         include: {
  //           conversations: true,
  //           conversations2: true
  //         }
  //       }
  //     },
  //   })

  //   const convChecked = matches.map((match) => {
  //     match.utilisateur.conversations.some((conv) => {
  //       if (conv.fk_utilisateur2_id == match.fk_utilisateur_id && conv.fk_utilisateur1_id == id) {
  //         return true;
  //       }
  //     })
  //     match.utilisateur.conversations2.some((conv) => {
  //       if (conv.fk_utilisateur1_id == match.fk_utilisateur_id && conv.fk_utilisateur2_id == id) {
  //         return true;
  //       }
  //     })
  //     return match

  //   })
  //   //recup les count dans un objet
  //   let count = {}
  //   convChecked.forEach((cv) => {
  //     if (count[cv.fk_utilisateur_id]) {
  //       count[cv.fk_utilisateur_id] = count[cv.fk_utilisateur_id] + 1
  //     } else {
  //       count[cv.fk_utilisateur_id] = 1
  //     }
  //   })

  //   //transfere en array
  //   const groupBy = Object.keys(count).map((obj) => {
  //     const numberOfMatch = count[obj]
  //     const fk_utilisateur_id = obj

  //     return { numberOfMatch: numberOfMatch, fk_utilisateur_id: fk_utilisateur_id }
  //   })

  //   return res.json(groupBy)

  // }
  const matches = await prisma.$queryRaw(`SELECT
  U2.id AS util2,
  SUM( IF( RU2.fk_utilisateur_id IS NULL, 0, 1 ) ) as numberOfMatch
FROM
  utilisateurs U1
      INNER JOIN utilisateurs U2
          ON U1.id <> U2.id
      LEFT JOIN conversations C
          ON (
              U1.id = C.fk_utilisateur1_id
              AND U2.id = C.fk_utilisateur2_id
          ) OR (
              U2.id = C.fk_utilisateur1_id
              AND U1.id = C.fk_utilisateur2_id
          )
      INNER JOIN reponses_utilisateurs RU1
          ON U1.id = RU1.fk_utilisateur_id
      LEFT JOIN reponses_utilisateurs RU2
          ON RU1.fk_reponse_id = RU2.fk_reponse_id
          AND U2.id = RU2.fk_utilisateur_id
WHERE
  U1.id = ${id}
  AND C.id IS NULL
GROUP BY U2.id
ORDER BY numberOfMatch desc`)
//   const matches = await prisma.$queryRaw(`SELECT
//   U1.id as util1, U2.id AS util2,
//    SUM( IF( RU2.fk_utilisateur_id IS NULL, 0, 1 ) ) as numberOfMatch
// FROM
//    utilisateurs U1
//        INNER JOIN utilisateurs U2
//            ON U1.id <> U2.id
//        INNER JOIN reponses_utilisateurs RU1
//            ON U1.id = RU1.fk_utilisateur_id
//        LEFT JOIN reponses_utilisateurs RU2
//            ON RU1.fk_reponse_id = RU2.fk_reponse_id
//            AND U2.id = RU2.fk_utilisateur_id
// WHERE U1.id = ${id}
// GROUP BY U2.id
// ORDER BY numberOfMatch desc`)

  return res.json(matches)
})
// Login

router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body
  if (email === null || mot_de_passe === null) return res.status(400).json({ 'error': 'missing parameters' })
  const users = prisma.utilisateurs.findUnique({
    where: {
      email: email
    }
  })
    .then(function (userFound) {
      if (userFound) {
        bcrypt.compare(mot_de_passe, userFound.mot_de_passe, function (errBycrypt, resBycrypt) {
          if (resBycrypt) {
            return res.status(200).json({
              'userId': userFound.id,
              'est_admin': userFound.est_admin,
              'token': jwtUtils.generateTokenForUser(userFound)
            })
          } else {
            return res.status(403).json({ 'error': 'invalid password' })
          }
        })
      }
      else {
        return res.status(404).json({ 'error': 'Email ou mot de passe non valide' })
      }

    })
    .catch((error) => {
      return res.status(500).json({ 'error': 'impossible de verifier user' })

    })

})
router.post('/register', async (req, res) => {
  const { prenom, mot_de_passe, email } = req.body
  let date_de_naissance = req.body.date_de_naissance
  if (email === null || prenom == null || mot_de_passe === null || date_de_naissance == null) return res.status(400).json({ 'error': 'missing parameters' })
  date_de_naissance = new Date(date_de_naissance)

  const users = prisma.utilisateurs.findUnique({
    where: {
      email: email
    }
  })
    .then(function (userFound) {
      if (!userFound) {
        bcrypt.hash(mot_de_passe, 5, function (err, bcrypytedPassword) {
          const user = prisma.utilisateurs.create({
            data: {
              prenom: prenom,
              date_de_naissance: date_de_naissance,
              est_admin: false,
              email: email,
              mot_de_passe: bcrypytedPassword
            },
          }).then(function (newUser) {
            return res.status(201).json({ 'userId': newUser.id })
          }).catch(function (err) {
            return res.status(500).json({ 'error': 'impossible de verifier user' })
          })
        })
      } else {
        return res.status(409).json({ 'error': 'utilisateur présent' })
      }
    })
})

// retrouver tous les  utilisateur
router.get('/', async (req, res) => {
  const users = await prisma.utilisateurs.findMany()
  res.json(users)
})
// retrouver un utilisateur selon l'id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const users = await prisma.utilisateurs.findUnique({
    include: {
      photo_utilisateur: true, // Return all fields
    },
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
  let { prenom, email, mot_de_passe, date_de_naissance, biographie, est_admin } = req.body
  date_de_naissance = new Date(date_de_naissance)
  bcrypt.hash(mot_de_passe, 5, async (err, bcrypytedPassword) => {
    const post = await prisma.utilisateurs.create({
      data: {
        prenom,
        email,
        mot_de_passe: bcrypytedPassword,
        date_de_naissance,
        biographie,
        est_admin
      },
    })
    res.json(post)

  })
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
