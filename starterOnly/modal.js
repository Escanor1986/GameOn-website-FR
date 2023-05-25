function editNav() {
  let x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// Close DOM element
const modalClose = document.querySelector(".close");
// close modal event
modalClose.addEventListener("click", (event) => {
  event.preventDefault();
  // close modal form
  console.log("modal closed !");
  modalbg.style.display = "none";
});

// Gestion du formulaire
const emailRegExp = new RegExp(
  "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
);
const charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");

function validate() {
  // Récupération des éléments du formulaire
  const firstName = document.getElementById("first");
  const lastName = document.getElementById("last");
  const email = document.getElementById("email");
  const birthdate = document.getElementById("birthdate");
  const quantity = document.getElementById("quantity");
  const location = document.getElementsByName("location");
  const checkbox1 = document.getElementById("checkbox1");

  // Vérification de complétion des champs obligatoires
  if (firstName.value.trim() === "") {
    alert("Veuillez entrer votre prénom.");
    return false;
  } else if (!charRegExp.test(firstName.value.trim())) {
    alert(
      "Le prénom doit contenir au moins 2 caractères et ne peut contenir que des lettres, des espaces, des virgules, des apostrophes, des tirets ou des points."
    );
    return false;
  }

  if (lastName.value.trim() === "") {
    alert("Veuillez entrer votre nom.");
    return false;
  } else if (!charRegExp.test(lastName.value.trim())) {
    alert(
      "Le nom doit contenir au moins 2 caractères et ne peut contenir que des lettres, des espaces, des virgules, des apostrophes, des tirets ou des points."
    );
    return false;
  }

  if (email.value.trim() === "") {
    alert("Veuillez entrer votre adresse e-mail.");
    return false;
  } else if (!emailRegExp.test(email.value.trim())) {
    alert("Veuillez entrer une adresse e-mail valide.");
    return false;
  }

  if (birthdate.value.trim() === "") {
    alert("Veuillez entrer votre date de naissance.");
    return false;
  }

  if (quantity.value.trim() === "") {
    alert(
      "Veuillez entrer le nombre de tournois GameOn auxquels vous avez déjà participé."
    );
    return false;
  }

  if (!checkbox1.checked) {
    alert("Veuillez accepter les conditions d'utilisation.");
    return false;
  }

  // Vérification de sélection d'un emplacement
  let locationChecked = false;
  for (let i = 0; i < location.length; i++) {
    if (location[i].checked) {
      locationChecked = true;
      break;
    }
  }
  if (!locationChecked) {
    alert("Veuillez sélectionner un emplacement pour le tournoi.");
    return false;
  }

  // Tous les champs sont valides, le formulaire peut être envoyé
  alert("Bravo, votre inscription est terminée !");
  return true;
}
