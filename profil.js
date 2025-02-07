// profile.js

import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-storage.js";

const auth = getAuth();
const storage = getStorage();

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    const profilePictureUpload = document.getElementById('profilePictureUpload');
    const profileSuccess = document.getElementById('profileSuccess');
    const profileError = document.getElementById('profileError');

    // --- Fonction pour afficher les informations du profil utilisateur ---
    function displayUserProfile() {
        const user = auth.currentUser;
        if (user) {
            document.getElementById('name').value = user.displayName || '';
            document.getElementById('email').value = user.email;
            // Pour le numéro de téléphone, vous devrez peut-être le récupérer d'une autre source de données
            // (Firebase Firestore, Realtime Database, ou user metadata si vous l'avez stocké là).
            // Pour cet exemple simple, nous laissons le champ téléphone vide au chargement.

            // Afficher la photo de profil si elle existe
            if (user.photoURL) {
                profileImageDisplay.src = user.photoURL;
            } else {
                profileImageDisplay.src = 'images/default-profile.png'; // Image par défaut si pas de photo
            }
        } else {
            // Utilisateur non connecté, rediriger vers la page de connexion (ou gérer selon votre besoin)
            console.log("Utilisateur non connecté. Redirection vers la page de connexion.");
            window.location.href = 'login.html'; // Rediriger vers login si non connecté
        }
    }

    // --- Fonction pour mettre à jour le profil utilisateur (Nom et Téléphone) ---
    async function updateProfileData(name, phone) {
        try {
            const user = auth.currentUser;
            if (user) {
                await updateProfile(user, {
                    displayName: name
                });
                // Ici, vous pouvez choisir de mettre à jour le numéro de téléphone
                // dans une base de données séparée (Firestore, Realtime Database)
                // ou dans les user metadata si cela convient à votre application.
                // Pour cet exemple, nous ne mettons pas à jour le téléphone côté serveur,
                // mais vous pouvez ajouter cette logique ici.

                displaySuccessMessage("Profil mis à jour avec succès !");
                hideErrorMessage();
                displayUserProfile(); // Recharger les infos mises à jour dans le formulaire
            } else {
                throw new Error("Utilisateur non connecté.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            displayErrorMessage("Erreur lors de la mise à jour du profil.");
            hideSuccessMessage();
        }
    }

    // --- Fonction pour gérer l'upload de la photo de profil ---
    async function uploadProfilePicture(file) {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("Utilisateur non connecté.");
            }

            const storageRef = ref(storage, `profile-pictures/${user.uid}/${file.name}`); // Chemin dans Firebase Storage
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            await updateProfile(user, {
                photoURL: downloadURL
            });

            profileImageDisplay.src = downloadURL; // Mettre à jour l'image affichée
            displaySuccessMessage("Photo de profil mise à jour !");
            hideErrorMessage();

        } catch (error) {
            console.error("Erreur lors de l'upload de la photo de profil:", error);
            displayErrorMessage("Erreur lors de l'upload de la photo de profil.");
            hideSuccessMessage();
        }
    }


    // --- Fonctions utilitaires pour les messages de succès et d'erreur ---
    function displayErrorMessage(message) {
        profileError.textContent = message;
        profileError.style.display = 'block';
    }

    function hideErrorMessage() {
        profileError.style.display = 'none';
    }

    function displaySuccessMessage(message) {
        profileSuccess.textContent = message;
        profileSuccess.style.display = 'block';
        hideErrorMessage(); // Cacher les erreurs si succès
    }

    function hideSuccessMessage() {
        profileSuccess.style.display = 'none';
    }

    // --- Gestionnaires d'événements ---

    // Gestion du submit du formulaire de profil
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        updateProfileData(name, phone);
    });

    // Gestion du changement de fichier dans l'input pour la photo de profil
    profilePictureUpload.addEventListener('change', function(event) {
        const file = event.target.files[0]; // Récupérer le fichier sélectionné
        if (file) {
            uploadProfilePicture(file);
        }
    });

    // Afficher les informations du profil au chargement de la page
    displayUserProfile();
});
