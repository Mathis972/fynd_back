const express=require('express')
const router=express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Login

router.post('/login', async (req, res) => {
})
router.post('/register', async (req, res) => {
const {prenom, mot_de_passe, email, biographie} = req.body
let date_de_naissance = req.body.date_de_naissance
if (email === null || prenom == null || mot_de_passe === null) return res.status(400).json({'error': 'missing parameters'})
  const users =  prisma.utilisateurs.findUnique({
    where:{
      email: email
    }
  })
  .then(function(userFound){
    if (!userFound){
      bcrypt.hash(mot_de_passe, 5, function (err, bcrypytedPassword){
        date_de_naissance = new Date(date_de_naissance)
        const user =  prisma.utilisateurs.create({
          data: {
            prenom : prenom,
            email : email,
            mot_de_passe : bcrypytedPassword,
            date_de_naissance :date_de_naissance,
            biographie : biographie,
          },
        }).then( function(newUser){
          return res.status(201).json({'userId': user.id})
        }).catch(function(err){
          return res.status(500).json({'error': 'impossible de verifier user'})
        })
      })
    } else{
      return res.status(409).json({'error': 'utilisateur présent'})
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
  const {id} = req.params
  const users = await prisma.utilisateurs.findUnique({
    where:{
      id: parseInt(id)
    }
  })
  res.json(users)
})
// supprimer un utilisateur selon l'id
router.delete('/:id', async (req, res) => {
  const {id} = req.params
  const users = await prisma.utilisateurs.delete({
    where:{
      id: parseInt(id)
    }
  })
  res.json(`l'utilisateurs ${users.prenom} est supprimé`)
})
// ajouter un utilisateur
router.post('/', async (req, res) => {
  console.log(req.body)
  let { prenom, email, mot_de_passe,date_de_naissance,biographie } = req.body
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
  let { prenom, email, mot_de_passe,date_de_naissance,biographie } = req.body

  const post = await prisma.utilisateurs.update({
    where: { id:parseInt(id) },
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
module.exports=router
