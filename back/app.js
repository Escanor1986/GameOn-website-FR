require("dotenv").config();
const express = require("express");
const createTransport = require("nodemailer");
const app = express();
//on exporte app vers config
module.exports = app;

app.use(express.json());

// Endpoint pour la soumission du formulaire
app.post("/submit-form", (req, res) => {
  const { firstName, lastName, email, birthdate, quantity, location } =
    req.body;

  // Création du transporteur pour l'envoi d'e-mails (utilisez vos propres informations d'authentification)
  const transporter = createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
    },
  });

  // Options de l'e-mail
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Confirmation d'inscription au prochain tournoi de GameOn !",
    html: `
      <h1>Nouvelle inscription au tournoi de la part de :</h1>
      <p>Prénom: ${firstName}</p>
      <p>Nom: ${lastName}</p>
      <p>E-mail: ${email}</p>
      <p>Date de naissance: ${birthdate}</p>
      <p>Nombre de tournois à votre actif: ${quantity}</p>
      <p>Ville souhaitée pour le lieu du tournoi: ${location}</p>
      <br />
      <p>Cet E-mail en réponse vaut accusé de réception et de validation pour votre inscription au tournoi !</p>
      <p>Conservez-le jusqu'au jour J !</p>
    `,
  };

  // Envoi de l'e-mail
  transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log("E-mail envoyé :", info.response);
      res.json({ success: true, message: "Formulaire soumis avec succès !" });
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'envoi de l'e-mail.",
      });
    });
});
