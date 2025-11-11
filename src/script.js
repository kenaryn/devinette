'use strict';

import { dico } from './dico.js';

let indexAleatoire = 0;
let motATrouver = '';
const resetButton = document.getElementById('reset');
let motATrouverTag = document.getElementById('mot_a_trouver');

const reveler_lettre = function(lettre) {
  let motDansDom = motATrouverTag.textContent.split('');

  // chercher si la lettre cliquée est trouvée dans le mot
  for (let i = 0; i < motATrouver.length; i++) {
    if (motATrouver[i] === lettre) {
      motDansDom[i] = lettre;
    }
  }
  // assigner cette lettre cliquée au mot à trouver pour le (re)construire
  motATrouverTag.textContent = motDansDom.join('');
}

/**
 * Gérer le compteur d'essais restants
 *
 * @param event transmis par defaut lors du déclenchement d'un event
 */
const rechercher_lettre = function (event) {
  const lettre = event.target.textContent;
  let essaisRestants = document.getElementById('essaisRestants');

  if (motATrouver.includes(lettre)) {
    reveler_lettre(lettre);
  } else {
    /*
      Décrémente le compteur d'essais
      convertit type string en number grâce à l'opérateur unaire `+`
      pour éviter les effets indésirables dûs au transtypage implicite
     */
    let essaisRestantsActuels = +essaisRestants.textContent;
    essaisRestants.textContent = (essaisRestantsActuels - 1).toString();
  }

  // Désactiver bouton pour le confort du joueur
  document.getElementById(lettre).disabled = true;
  verifier_victoire(essaisRestants);
}

const creer_mot_a_trouver = function () {
  indexAleatoire = Math.floor(Math.random() * dico.length);
  motATrouver = dico[indexAleatoire];
}

const masquer_mot = function() {
  motATrouverTag.textContent = motATrouver.replace(/\S/g, '_');
}

const init = function () {
  for (let i = 65; i <= 90; i++) {
    const lettre = String.fromCharCode(i);
    const bouton = document.createElement('button');
    bouton.textContent = lettre;
    bouton.setAttribute('id', lettre);
    bouton.addEventListener('click', rechercher_lettre);
    document.getElementById('alphabet').append(bouton);
  }
  creer_mot_a_trouver();
  masquer_mot();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

const desactiver_boutons = function () {
  document.querySelectorAll('div#alphabet button').forEach((bouton) => {
    bouton.setAttribute('disabled', 'true');
  });
}

const ajouter_message_final = function (msg) {
  const p = document.createElement('p');
  p.textContent = msg === 'victoire' ? 'Vous avez gagné!' : 'Vous avez perdu!';
  p.classList.add(msg);
  document.body.insertBefore(p, resetButton);
}

const verifier_victoire = function (nbEssais) {
  if (parseInt(nbEssais.textContent) === 0) {
    desactiver_boutons();
    ajouter_message_final('defaite');

    // Révéler le mot à trouver entièrement
    motATrouverTag.textContent = motATrouver;
    return;  // avoid awkwardness
  }

  if (!motATrouverTag.textContent.includes('_')) {
    desactiver_boutons();
    ajouter_message_final('victoire');
  }
}


const reset = function () {
  document.getElementById('essaisRestants').textContent = '5';
  creer_mot_a_trouver();
  masquer_mot();

  // Re-activer les boutons de lettres
  document.querySelectorAll('div#alphabet button').forEach((bouton) => {
    bouton.removeAttribute('disabled');
  });

  // Supprimer le message de défaite/victoire
  if (document.querySelector('p.defaite')) {
    document.querySelector('p.defaite').remove();
  } else if (document.querySelector('p.victoire')) {
    document.querySelector('p.victoire').remove();
  }
}

resetButton.addEventListener('click', reset);