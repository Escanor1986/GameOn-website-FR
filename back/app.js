require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();

app.use(express.json());

// On utilise Helmet pour sécuriser les en-têtes HTTP
app.use(helmet());

// On utilise Express Rate Limit pour limiter le nombre de requêtes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes max par IP
});

app.use("/submit-form", limiter);

// Middelware pour autoriser les requêtes cross-origin
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

// Middelware pour valider les entrées utilisateurs
function validateInput(req, res, next) {
  const { firstName, lastName, email, birthdate, quantity, location } =
    req.body;

  if (
    (firstName.length < 2 && typeof firstName === "string") ||
    (lastName.length < 2 && typeof lastName === "string") ||
    (!email.includes("@") && typeof email === "string") ||
    !email.includes(".") ||
    (birthdate.length !== 10 && typeof birthdate === "string") ||
    isNaN(quantity) ||
    typeof location === "boolean"
  ) {
    return res.status(400).json({
      success: false,
      message: "Veuillez vérifier les informations saisies.",
    });
  } else {
    next();
  }
}

// Route pour soumettre le formulaire
app.post("/submit-form", validateInput, async (req, res) => {
  const { firstName, lastName, email, birthdate, quantity, location } =
    req.body;

  console.log(req.body);

  // Implémentation de la logique SMTP pour l'envoi d'un email de confirmation via Google avec OAuth2
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lionel.zovi@gmail.com",
      pass: process.env.PASSWORD,
    },
  });

  // Options de l'e-mail
  const mailOptions = {
    from: "lionel.zovi@gmail.com", // Sender address
    to: "lionel.zovi@gmail.com", // Recipient address
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
});

module.exports = app;
