const { PrismaClient } = require("@prisma/client")
var faker = require('faker');
faker.locale = "fr";
const prisma = new PrismaClient()

const main = async () => {
    await prisma.raisons_inscriptions.create({
      data : {
        libelle : 'selon feeling'
      }
    })
    await prisma.raisons_inscriptions.create({
      data : {
        libelle : 'amitié'
      }
    })
    await prisma.raisons_inscriptions.create({
      data : {
        libelle : 'soirée sans lendemain'
      }
    })

  //questions


  await prisma.questions.create({
    data: {
      message : 'Quel hobby te correspond le mieux ?',
      reponse : {
        create : [
        {
          message_reponse : 'Voyage'
        },
        {
          message_reponse : 'Sport'
        },
        {
          message_reponse : 'Bien-être'
        },
        {
          message_reponse : 'Films'
        }
      ]
      }
    }
  })
  await prisma.questions.create({
    data: {
      message : 'Tu gagnes 10 000 euros, tu ...',
      reponse : {
        create : [
        {
          message_reponse : 'Reverse tout à une association'
        },
        {
          message_reponse : 'Offre un cadeau à tes parents ou à tes proches'
        },
        {
          message_reponse : 'Pars en voyage'
        },
        {
          message_reponse : 'Dépense tout rapidement'
        }
      ]
      }
    }
  })


  for (let index = 0; index <= 5; index++) {
    await prisma.utilisateurs.create({
      data: {
        prenom : faker.name.firstName(),
        email : faker.internet.email(),
        mot_de_passe : faker.internet.password(),
        date_de_naissance :faker.date.between('1997-01-01', '2015-01-05'),
        biographie : faker.lorem.text(),
        lri:{
          create : {
            raison_inscription :{
              connect : {
                id:Math.floor(Math.random() * 3)+1
              }
            }
          }
        },
        photo_utilisateur : {
          create : [
          {
          photo_url : faker.image.imageUrl(),
          est_photo_profil : true,
          },
          {
          photo_url : faker.image.imageUrl(),
          est_photo_profil : true,
          }
        ]
        }
      }
    })
  }
  //ajouter une conversation par rapport au utilisateur créer
  for (let index = 0; index <= 3; index++) {
    await prisma.conversations.create({
      data : {
        est_enregistre : true,
        ajout_utilisateurs1:true,
        ajout_utilisateurs2:true,
        utilisateurs1 :{
      connect : {
        id : Math.floor(Math.random() * 5)+1
      }
      },
      utilisateur2 : {
        connect :{
        id: Math.floor(Math.random() * 5) + 1
      }
      }
      }
    })
  }
  //creation messages selon conversations
  for (let index = 0; index <= 10; index++) {
    await prisma.messages.create({
      data : {
        conversation : {
          connect : {
            id : Math.floor(Math.random() * 3) + 1
          }
        },
        contenu : faker.lorem.paragraph(),
        send_by_user1 :  Boolean(Math.round(Math.random()))

      }
    })

  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })