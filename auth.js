// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCq9c9qmI3MveU5QyXlIIWAd30mBuDOszs",
    authDomain: "dacapo-d52dd.firebaseapp.com",
    projectId: "dacapo-d52dd",
    storageBucket: "dacapo-d52dd.firebasestorage.app",
    messagingSenderId: "1079219701883",
    appId: "1:1079219701883:web:4025169b69ea916bcfbade",
    measurementId: "G-HGQWX0JER7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication

// --- Fonctions pour l'authentification ---

// Fonction pour l'inscription
async function signup(name, email, password, phone) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Mettre à jour le profil utilisateur avec le nom
        await updateProfile(user, {
            displayName: name
        });

        console.log("Utilisateur inscrit:", user);
        // alert("Inscription réussie !"); // Suppression de l'alerte, redirection à la place
        // Rediriger l'utilisateur vers main.html après inscription réussie
        window.location.href = 'main.html';

    } catch (error) {
        console.error("Erreur lors de l'inscription:", error.code, error.message);
        let errorMessage = "Erreur lors de l'inscription.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Cet email est déjà utilisé.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Adresse email invalide.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Mot de passe trop faible. Il doit contenir au moins 6 caractères.";
        }
        displayError('signupError', errorMessage); // Afficher l'erreur dans signup.html
    }
}

// Fonction pour la connexion
async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Utilisateur connecté avec succès!");
        // alert("Connexion réussie !"); // Suppression de l'alerte, redirection à la place
        // Rediriger l'utilisateur vers main.html après connexion réussie
        window.location.href = 'main.html';

    } catch (error) {
        console.error("Erreur lors de la connexion:", error.code, error.message);
        let errorMessage = "Erreur lors de la connexion.";
        if (error.code === 'auth/invalid-credential') {
            errorMessage = "Email ou mot de passe invalide.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Adresse email invalide.";
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = "Ce compte utilisateur a été désactivé.";
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = "Utilisateur non trouvé.";
        }
        displayError('loginError', errorMessage); // Afficher l'erreur dans login.html
    }
}

// Fonction pour mot de passe oublié
async function forgotPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Email de réinitialisation du mot de passe envoyé à:", email);
        alert("Un email de réinitialisation de mot de passe vous a été envoyé.");
        // Vous pouvez afficher un message de succès à l'utilisateur
        displaySuccess('forgotPasswordSuccess', "Email de réinitialisation envoyé. Consultez votre boîte de réception."); // Afficher succès dans forgot_password.html
        hideError('forgotPasswordError'); // S'assurer que l'erreur est cachée si elle était affichée avant
    } catch (error) {
        console.error("Erreur lors de la demande de réinitialisation du mot de passe:", error.code, error.message);
        let errorMessage = "Erreur lors de la demande de réinitialisation.";
        if (error.code === 'auth/invalid-email') {
            errorMessage = "Adresse email invalide.";
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = "Utilisateur non trouvé pour cet email.";
        }
        displayError('forgotPasswordError', errorMessage); // Afficher l'erreur dans forgot_password.html
        hideSuccess('forgotPasswordSuccess'); // S'assurer que le succès est caché si affiché avant
    }
}

// --- Fonctions utilitaires pour afficher les erreurs et succès dans l'HTML ---

function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block'; // Assurer que l'élément est visible
    } else {
        console.error(`Element avec l'ID '${elementId}' non trouvé pour afficher l'erreur.`);
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none'; // Cacher l'élément d'erreur
    }
}

function displaySuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block'; // Assurer que l'élément est visible
        hideError(elementId.replace('Success', 'Error')); // Cacher l'erreur associée si elle existe
    } else {
        console.error(`Element avec l'ID '${elementId}' non trouvé pour afficher le message de succès.`);
    }
}

function hideSuccess(elementId) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.style.display = 'none'; // Cacher l'élément de succès
    }
}


// --- Gestionnaires d'événements pour les formulaires ---

// Gestionnaire pour le formulaire d'inscription (si la page signup.html est chargée)
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher la soumission par défaut du formulaire

        // Récupérer les valeurs des champs
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value; // Optionnel

        // Appeler la fonction d'inscription
        signup(name, email, password, phone);
    });
}

// Gestionnaire pour le formulaire de connexion (si la page login.html est chargée)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher la soumission par défaut du formulaire

        // Récupérer les valeurs des champs
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Appeler la fonction de connexion
        login(email, password);
    });
}

// Gestionnaire pour le formulaire de mot de passe oublié (si la page forgot_password.html est chargée)
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher la soumission par défaut du formulaire

        // Récupérer la valeur de l'email
        const email = document.getElementById('email').value;

        // Appeler la fonction de mot de passe oublié
        forgotPassword(email);
    });
}
