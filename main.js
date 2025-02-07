// main.js

import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    const smallProfilePictureContainer = document.getElementById('smallProfilePictureContainer');
    const smallProfileImageDisplay = document.getElementById('smallProfileImageDisplay');

    // --- Fonction pour afficher la petite photo de profil ---
    function displaySmallProfilePicture() {
        const user = auth.currentUser;
        if (user) {
            if (user.photoURL) {
                smallProfileImageDisplay.src = user.photoURL; // Afficher la photo de profil si elle existe
            } else {
                smallProfileImageDisplay.src = 'images/default-profile.png'; // Image par défaut si pas de photo
            }
        } else {
            // Utilisateur non connecté, rediriger vers la page de connexion (sécurité - optionnel ici car main.html est atteinte après connexion)
            console.log("Utilisateur non connecté sur main.html. Redirection vers login.html.");
            window.location.href = 'login.html';
        }
    }

    // --- Gestionnaire d'événement pour le clic sur la petite photo de profil ---
    smallProfilePictureContainer.addEventListener('click', function() {
        window.location.href = 'profil.html'; // Rediriger vers profil.html au clic
    });

    // --- Afficher la petite photo de profil au chargement de la page ---
    displaySmallProfilePicture();
});
