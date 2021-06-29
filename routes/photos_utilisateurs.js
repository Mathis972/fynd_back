const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs');
const aws = require('aws-sdk');
const multer = require('multer');// "multer": "^1.1.0"
const multerS3 = require('multer-s3'); //"^1.4.1"

aws.config.update({
  accessKeyId: 'AKIA35P3ZT6JP5DGYNUH',
  secretAccessKey: '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',
});
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });
s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'filefynd',

      key: function (req, file, cb) {
          console.log(file);
          const file_name = new Date().getTime() + '_' + file.originalname
          cb(null, file_name); //use Date.now() for unique file keys
      },
      contentType: multerS3.AUTO_CONTENT_TYPE
    })
});
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

// router.post('/', async (req, res) => {
// const params = req.body
// console.log(req.body)
// console.log(req.files)
// if (!req.files)
//     return res.status(422).json('vous n\'avez pas mis de photo')
//   const file = req.files.image
//   const file_name = new Date().getTime() + '_' + file.name
//   params.image = `image/${file_name}`
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
//     file.mv('public/image/' + file_name, async (err) => {
//       if (err)
//         return res.status(500).json(err)
//         const question = await prisma.photos_utilisateurs.create({
//           data: {
//             photo_url: params.image,
//             fk_utilisateur_id: parseInt(params.fk_utilisateur_id),
//             est_photo_profil:  JSON.parse(params.est_photo_profil)
//           }
//         })
//         res.json(question)
//     })
//   } else {
//     return res.status(500).json('pas le bon format')
//   }
// })

//Utilisation de aws S3 pour le stockage des photos
router.post('/', upload.array('upl'), async function (req, res, next) {
  const params = req.body
  file = req.files[0]
  console.log(req.files[0].mimetype)
  if (!req.files)
    return res.status(422).json('vous n\'avez pas mis de photo')
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
       const question = await prisma.photos_utilisateurs.create({
          data: {
            photo_url: req.files[0].location,
            fk_utilisateur_id: parseInt(params.fk_utilisateur_id),
            est_photo_profil:  JSON.parse(params.est_photo_profil)
          }
        })
        res.json(question)
      } else{
      }
});

// router.put('/:id', (req, res) => {
//   const params = req.body
//   const { id } = req.params


//   var file = req.files.image
//   const file_name = new Date().getTime() + '_' + file.name
//   params.image = `image/${file_name}`

//   if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
//     file.mv('public/image/' + file_name, async (err) => {
//       if (err)
//         return res.status(500).json(err)

//         const photoOld = await prisma.photos_utilisateurs.findUnique({
//         where:{
//           id: parseInt(id),
//         }
//         })
//         console.log(photoOld)
//         fs.unlink("public/"+photoOld.photo_url,function(err){
//           if(err) throw err;
//           console.log('File deleted!');
//       });
//         const newPhoto = await prisma.photos_utilisateurs.update({
//           where: {
//             id: parseInt(id),
//           },
//           data: {
//             photo_url: params.image
//           }
//         })
//           if (!err) res.json(`update fait`)
//           else console.log(err)
//     })
//   } else {
//     return res.status(500).json('pas le bon format')
//   }
// })

router.put('/:id', upload.array('upl'), async function (req, res, next) {
  const params = req.body
  const { id } = req.params
  file = req.files[0]
  console.log(req.files[0].mimetype)
  if (!req.files)
    return res.status(422).json('vous n\'avez pas mis de photo')
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {

      const photoOld = await prisma.photos_utilisateurs.findUnique({
        where:{
          id: parseInt(id),
        }
        })
        const photo = photoOld.photo_url.replace('https://filefynd.s3.amazonaws.com/', '')
        var params2 = {  Bucket: 'filefynd', Key: photo };
        s3.deleteObject(params2, function(err, data) {
          if (err) console.log(err, err.stack);  // error
          else     console.log('deleted');                 // deleted
        });

        const newPhoto = await prisma.photos_utilisateurs.update({
          where: {
            id: parseInt(id),
          },
          data: {
            photo_url: req.files[0].location,
          }
        })
        res.json(newPhoto)
      } else{
      }
});

// router.put('/:id', (req, res) => {
//   const params = req.body
//   const { id } = req.params


//   var file = req.files.image
//   const file_name = new Date().getTime() + '_' + file.name
//   params.image = `image/${file_name}`

//   if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
//     file.mv('public/image/' + file_name, async (err) => {
//       if (err)
//         return res.status(500).json(err)

//         const photoOld = await prisma.photos_utilisateurs.findUnique({
//         where:{
//           id: parseInt(id),
//         }
//         })
//         var params = {  Bucket: 'filefynd', Key: photoOld.photo_url };

//         console.log(photoOld)
//         fs.unlink("public/"+photoOld.photo_url,function(err){
//           if(err) throw err;
//           console.log('File deleted!');
//       });
//         const newPhoto = await prisma.photos_utilisateurs.update({
//           where: {
//             id: parseInt(id),
//           },
//           data: {
//             photo_url: params.image
//           }
//         })
//           if (!err) res.json(`update fait`)
//           else console.log(err)
//     })
//   } else {
//     return res.status(500).json('pas le bon format')
//   }
// })
module.exports = router
