require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const credentials = require("./Google_ID.json");
const app = express();
const OAuth2 = google.auth.OAuth2;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Max-Age", 80000);
  next();
});

app.post("/submit-form", async (req, res) => {
  const { firstName, lastName, email, birthdate, quantity, location } =
    req.body;

  console.log(req.body);

  // Implémentation de la logique SMTP pour l'envoi d'un email de confirmation via Google avec OAuth2

  // Création d'un client OAuth2 avec les identifiants client et secret
  const authClient = new OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris
  );

  // Définition de la portée et de la redirection
  const scopes = [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.compose",
  ];

  // Obtenir un jeton d'accès
  const url = authClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  // Rediriger l'utilisateur vers l'URL d'autorisation générée
  res.json({ url });

  const getToken = async (code) => {
    const { tokens } = await authClient.getToken(code);
    console.log("Jeton d'accès :", tokens.access_token);
    console.log("Jeton de rafraîchissement :", tokens.refresh_token);

    // Continuer avec l'envoi de l'e-mail en utilisant les jetons d'accès obtenus
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: credentials.client_id,
        clientSecret: credentials.client_secret,
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
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
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("E-mail envoyé :", info.response);
      res.json({ success: true, message: "Formulaire soumis avec succès !" });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'envoi de l'e-mail.",
      });
    }
  };

  // Utilisez le code d'autorisation reçu dans la requête de redirection pour obtenir les jetons
  const authorizationCode = "CODE_D_AUTORISATION";
  await getToken(authorizationCode);
});

module.exports = app;
