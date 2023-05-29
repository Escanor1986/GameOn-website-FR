/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
function editNav() {
  const x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  console.log("modal opened !");
  modalbg.style.display = "block";
}

// Close DOM element
const modalClose = document.querySelector(".close");
// close modal event
const closingModal = () => {
  modalClose.addEventListener("click", (event) => {
    event.preventDefault();
    // close modal form
    console.log("modal closed !");
    modalbg.style.display = "none";
  });
};

closingModal();

// Gestion du formulaire
const formValidity = {
  firstName: false,
  lastName: false,
  email: false,
  date: false,
  numberOfTournament: false,
  tournamentLocation: false,
  userCondition: false,
};

const charRegExp = /^[a-zA-Z ,.'-]+$/;
const emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
const dateRegExp = /^(\d{4})-(\d{2})-(\d{2})$/;

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

formInputs.forEach(({ selector, validation }) => {
  const input = form.querySelector(selector);
  input.addEventListener("blur", validation);
  input.addEventListener("input", validation);
});

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

function lastNameValidation() {
  if (lastNameInput.value.length >= 2 && charRegExp.test(lastNameInput.value)) {
    showValidation({ index: 1, validation: true });
    formValidity.lastName = true;
  } else {
    showValidation({ index: 1, validation: false });
    formValidity.lastName = false;
  }
}

function emailValidation() {
  if (emailRegExp.test(emailInput.value)) {
    showValidation({ index: 2, validation: true });
    formValidity.email = true;
  } else {
    showValidation({ index: 2, validation: false });
    formValidity.email = false;
  }
}

function dateValidation() {
  if (dateRegExp.test(dateInput.value)) {
    showValidation({ index: 3, validation: true });
    formValidity.date = true;
  } else {
    showValidation({ index: 3, validation: false });
    formValidity.date = false;
  }
}

function quantityValidation() {
  if (quantityInput.value >= 1 && quantityInput.value <= 100) {
    showValidation({ index: 4, validation: true });
    formValidity.numberOfTournament = true;
  } else {
    showValidation({ index: 4, validation: false });
    formValidity.numberOfTournament = false;
  }
}

function locationsValidation() {
  const radios = document.getElementsByName("location");

  let i = 0;
  while (!formValidity.tournamentLocation && i < radios.length) {
    if (radios[i].checked) {
      showValidation({ index: 5, validation: true });

      formValidity.tournamentLocation = true;
      i++;
    }
  }

  if (!formValidity.tournamentLocation) {
    showValidation({ index: 5, validation: false });

    alert("Veuillez sélectionner un lieu pour le tournoi !");
  } else {
    return formValidity.tournamentLocation;
  }
}

locationsValidation();

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

checkBoxValidation();

// const button = document.querySelector('.btn-submit');

validationForm.addEventListener("click", handleForm);

function handleForm(event) {
  event.preventDefault();

  const keys = Object.keys(formValidity);
  const failedInputs = keys.filter((key) => !formValidity[key]);
  console.log(failedInputs);

  if (failedInputs.length) {
    failedInputs.forEach((input) => {
      const index = keys.indexOf(input);
      showValidation({ index, validation: false });
    });
  } else {
    alert("Données envoyées avec succès !");
  }
}
