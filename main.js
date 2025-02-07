// main.js

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    const smallProfilePictureContainer = document.getElementById('smallProfilePictureContainer');
    const smallProfileImageDisplay = document.getElementById('smallProfileImageDisplay');

    // --- Fonction pour afficher la petite photo de profil ---
    function displaySmallProfilePicture(user) { // <-- Recevoir l'utilisateur en argument
        if (user) {
            // Utilisateur connecté, afficher la photo de profil ou l'image par défaut
            if (user.photoURL) {
                smallProfileImageDisplay.src = user.photoURL;
            } else {
                smallProfileImageDisplay.src = 'images/default-profile.png';
            }
        } else {
            // Utilisateur non connecté, rediriger vers la page de connexion
            console.log("Utilisateur non connecté sur main.html. Redirection vers login.html.");
            window.location.href = 'login.html';
        }
    }

    // --- Gestionnaire d'événement pour le clic sur la petite photo de profil ---
    smallProfilePictureContainer.addEventListener('click', function() {
        window.location.href = 'profil.html'; // Rediriger vers profil.html au clic
    });

    // --- Observer les changements d'état d'authentification ---
    onAuthStateChanged(auth, (user) => { // <-- Utilisation de onAuthStateChanged
        displaySmallProfilePicture(user); // Appeler displaySmallProfilePicture avec l'utilisateur (ou null)
    });
});
