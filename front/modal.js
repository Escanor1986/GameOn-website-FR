function editNav() {
  const x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// constante "interrupteur" pour la validation du formulaire
const formValidity = {
  firstName: false,
  lastName: false,
  email: false,
  date: false,
  numberOfTournament: false,
  tournamentLocation: false,
  userCondition: false,
};

// Expressions régulières pour la vérification des inputs concernés
const charRegExp = /^[a-zA-ZÀ-ÿ ,.'-]+$/u;
const emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
const dateRegExp = /^(\d{4})-(\d{2})-(\d{2})$/;

// DOM Elements
const modalClose = document.querySelector(".close");
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const sectionExitContent = document.querySelector(".section-exit-content");
const modalContent = document.querySelector(".content");

const form = document.querySelector("form[name='reserve']");
const validationForm = document.querySelector(".btn-submit");
const validationIcons = document.querySelectorAll(".icone-verif");
const validationTexts = document.querySelectorAll(".error-msg");

// Ici, on cible l'élément input qui se trouve dans
// le premier élément div ayant la classe formData
const firstNameInput = form.querySelector("div.formData:nth-child(1) input");
const lastNameInput = form.querySelector("div.formData:nth-child(2) input");
const emailInput = form.querySelector("div.formData:nth-child(3) input");
const dateInput = form.querySelector("div.formData:nth-child(4) input");
const quantityInput = form.querySelector("div.formData:nth-child(5) input");

// fonction de reset pour le formulaire
function resetForm() {
  const form = document.querySelector("form");
  form.reset();
  validationIcons.forEach((element) => {
    element.removeAttribute("style");
  });
  validationTexts.forEach((element) => {
    element.removeAttribute("style");
  });
}

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  console.log("modal opened !");
  modalbg.style.display = "block";
  resetForm();
}

// close modal event
const closingModal = () => {
  modalClose.addEventListener("click", (event) => {
    event.preventDefault();
    // close modal form
    console.log("modal closed !");
    modalbg.style.display = "none";
    resetForm();
  });
};

closingModal();

// Gestion de sélection des 5 premiers input dans le DOM
const formInputs = [
  {
    selector: "div.formData:nth-child(1) input",
    validation: firstNameValidation,
  },
  {
    selector: "div.formData:nth-child(2) input",
    validation: lastNameValidation,
  },
  { selector: "div.formData:nth-child(3) input", validation: emailValidation },
  { selector: "div.formData:nth-child(4) input", validation: dateValidation },
  {
    selector: "div.formData:nth-child(5) input",
    validation: quantityValidation,
  },
];

// Gestion de l'écoute des évènements sur les inputs de formInputs
// destructuring sur formInputs pour récupérer selector et validation
formInputs.forEach(({ selector, validation }) => {
  const input = form.querySelector(selector);
  input.addEventListener("blur", validation);
  input.addEventListener("input", validation);
});

// showValidation permet d'effectuer un "destructuring" pour passer en paramètre
// la fonction afin d'éviter de répéter de plus grosse partie de code
function showValidation({ index, validation }) {
  if (validation) {
    validationIcons[index].style.display = "inline";
    validationIcons[index].src = "icons/check.svg";
    validationIcons[index].style.background = "#279e7a";
    validationTexts[index].style.display = "none";
  } else {
    validationIcons[index].style.display = "inline";
    validationIcons[index].src = "icons/reject.svg";
    validationIcons[index].style.background = "red";
    validationTexts[index].style.display = "block";
  }
}

// Gestion des inputs séparément avec showValidation(visuel) et formValidity(interrupteur)
function firstNameValidation() {
  if (
    firstNameInput.value.length >= 2 &&
    charRegExp.test(firstNameInput.value)
  ) {
    showValidation({ index: 0, validation: true });
    formValidity.firstName = true;
  } else {
    showValidation({ index: 0, validation: false });
    formValidity.firstName = false;
  }
}

// Gestion des inputs séparément avec showValidation(visuel) et formValidity(interrupteur)
function lastNameValidation() {
  if (lastNameInput.value.length >= 2 && charRegExp.test(lastNameInput.value)) {
    showValidation({ index: 1, validation: true });
    formValidity.lastName = true;
  } else {
    showValidation({ index: 1, validation: false });
    formValidity.lastName = false;
  }
}

// Gestion des inputs séparément avec showValidation(visuel) et formValidity(interrupteur)
function emailValidation() {
  if (emailRegExp.test(emailInput.value)) {
    showValidation({ index: 2, validation: true });
    formValidity.email = true;
  } else {
    showValidation({ index: 2, validation: false });
    formValidity.email = false;
  }
}

// Gestion des inputs séparément avec showValidation(visuel) et formValidity(interrupteur)
function dateValidation() {
  if (dateRegExp.test(dateInput.value)) {
    showValidation({ index: 3, validation: true });
    formValidity.date = true;
  } else {
    showValidation({ index: 3, validation: false });
    formValidity.date = false;
  }
}

// Gestion des inputs séparément avec showValidation(visuel) et formValidity(interrupteur)
function quantityValidation() {
  if (quantityInput.value >= 1 && quantityInput.value <= 100) {
    showValidation({ index: 4, validation: true });
    formValidity.numberOfTournament = true;
  } else {
    showValidation({ index: 4, validation: false });
    formValidity.numberOfTournament = false;
  }
}

// Gestion des inputs séparément avec showValidation(visuel) et formValidity(interrupteur)
function locationsValidation() {
  const radios = document.getElementsByName("location");

  let i = 0;
  while (!formValidity.tournamentLocation && i < radios.length) {
    if (radios[i].checked) {
      showValidation({ index: 5, validation: true });
      formValidity.tournamentLocation = true;
    }
    i++; // Ajout de l'incrémentation de la variable i
  }

  if (!formValidity.tournamentLocation) {
    showValidation({ index: 5, validation: false });
    alert("Veuillez sélectionner un lieu pour le tournoi !");
  } else {
    return formValidity.tournamentLocation;
  }
}

// Gestion des inputs séparément avec showValidation(visuel) et formValidity(interrupteur)
function checkBoxValidation() {
  const checkBox = document.querySelector("#checkbox1");

  if (checkBox.checked) {
    showValidation({ index: 6, validation: true });
    formValidity.userCondition = true;
  } else {
    showValidation({ index: 6, validation: false });
    formValidity.userCondition = false;
    alert("Veuillez valider les conditions d'utilisations !");
  }

  return formValidity.userCondition;
}

// Gestion du modal post validation
function endForm() {
  console.log("Données envoyées avec succès !");
  console.log("form closed !");

  //fermeture du formulaire
  modalContent.style.display = "none";
  sectionExitContent.style.display = "block";

  sectionExitContent.innerHTML = "";

  const exitDiv = document.createElement("div");

  // création de la modal post validation dans le DOM
  exitDiv.innerHTML = `
          <div class="exit-content">
            <div class="exit-content-close-span">
            <span class="close"></span>
            </div>
            <div class="exit-content-input-container">
            <p class="close-text">Merci pour <br />Votre inscription</p>
            <input class="exit-btn" type="submit" class="button" value="Fermer" />
            </div>
          </div>
          `;
  exitDiv.className = "exit-content";
  sectionExitContent.append(exitDiv);

  const exitBtn = document.querySelector(".exit-btn");
  const exitSpan = document.querySelector(".close");

  const closingPostValidationModal = (event) => {
    event.preventDefault();

    console.log("modal closed !");

    modalbg.style.display = "none";
    sectionExitContent.style.display = "none";
    modalContent.style.display = "block";

    Object.keys(formValidity).forEach((key) => {
      formValidity[key] = true;
    });

    // On appelle resetForm lors de la fermeture pour réinitialiser le formulaire
    resetForm();
  };

  // On ajoute le même gestionnaire d'événement aux deux éléments
  exitBtn.addEventListener("click", closingPostValidationModal);
  exitSpan.addEventListener("click", closingPostValidationModal);
}

validationForm.addEventListener("click", handleForm);

// Gestion de validation du formulaire
async function handleForm(event) {
  event.preventDefault();

  // On appel locationsValidation && checkBoxValidation uniquement lors du click
  // pour vérifier si l'utilisateur à valider les 2 derniers inputs
  locationsValidation();
  checkBoxValidation();

  // On itère sur le contenu de tous les inputs
  const keys = Object.keys(formValidity);
  const failedInputs = keys.filter((key) => !formValidity[key]);
  console.log(failedInputs);

  // Si un ou plusieurs input(s) ont de la "longueur"
  if (failedInputs.length) {
    failedInputs.forEach((input) => {
      const index = keys.indexOf(input);
      // On set showValidation à false aux indexs correspondants
      showValidation({ index, validation: false });
    });
  } else {
    // si tout est valide, on appel endForm() pour générer la modal post validation
    endForm();
    // Récupération du formulaire
    const form = document.querySelector("form");

    // Écouteur d'événement pour la soumission du formulaire
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Récupération des valeurs des champs du formulaire
      const firstName = document.getElementById("first").value;
      const lastName = document.getElementById("last").value;
      const email = document.getElementById("email").value;
      const birthdate = document.getElementById("birthdate").value;
      const quantity = document.getElementById("quantity").value;
      const location = document.querySelector(
        'input[name="location"]:checked'
      ).value;

      // Envoi des données au serveur
      fetch("/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          birthdate,
          quantity,
          location,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Affichage de la réponse du serveur
          // Éventuellement, vous pouvez afficher un message de confirmation ou rediriger l'utilisateur ici
        })
        .catch((error) => {
          console.error("Erreur :", error);
          // Gérer l'erreur en conséquence
        });
    });
  }
}
