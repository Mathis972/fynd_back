var faker = require('faker');
faker.locale = "fr";

 const utilisateurs = {
  prenom : faker.name.firstName(),
  email : faker.internet.email(),
  est_admin : false,
  mot_de_passe : faker.internet.password(),
  date_de_naissance :faker.date.between('1997-01-01', '2015-01-05'),
  biographie : faker.lorem.text()
}