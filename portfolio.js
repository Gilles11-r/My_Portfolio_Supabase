const phrases = [
    "Frontend Developer",
    "Designer",
    "Web Developpeur"
]
// Index de la phrase actuelle
let phraseIndex = 0;

// Index de la lettre actuelle
let letterIndex = 0;

// État : true = écriture, false = effacement
let isTyping = true;

// Variable pour contrôler l'animation
let animationTimeout;

// Vitesse d'écriture (en millisecondes)
const typingSpeed = 100;

// Vitesse d'effacement (en millisecondes)
const deletingSpeed = 50;

// Pause entre effacement et nouvelle phrase (en millisecondes)
const pauseAfterDelete = 500;

// Pause après avoir écrit une phrase complète (en millisecondes)
const pauseAfterType = 2000;


function Ecriture(){
    const textElement = document.getElementById('text');

    const CurrentPhrase = phrases[phraseIndex];

    if(isTyping){
        textElement.textContent = CurrentPhrase.substring(0, letterIndex + 1);
        letterIndex++;

        if(letterIndex === CurrentPhrase.length){
            isTyping = false;
            animationTimeout = setTimeout(Ecriture , pauseAfterType);
            return;
        }
        animationTimeout = setTimeout(Ecriture, typingSpeed);
    }else{
        textElement.textContent = CurrentPhrase.substring(0, letterIndex - 1);
        letterIndex--;

        if(letterIndex === 0){
            isTyping = true;

            phraseIndex = (phraseIndex + 1)%phrases.length ;

            animationTimeout = setTimeout(Ecriture, pauseAfterDelete);
            return;
        }
        animationTimeout = setTimeout(Ecriture, deletingSpeed);
    }
}

window.addEventListener('load', () => {
    Ecriture();
});

const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuIcon.classList.toggle('bx-x');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Fermer le menu après le clic sur un lien
        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');
    });
});

// Envoi du formulaire de contact vers Supabase
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const subject = document.querySelector('#subject').value.trim();
        const message = document.querySelector('#message').value.trim();

        formStatus.textContent = "Envoi en cours...";
        formStatus.style.color = "#0ef";

        const { error } = await window.supabaseClient
            .from('Messages')          // nom exact de la table (majuscule)
            .insert([{
                Name: name,             // noms exacts des colonnes (majuscules)
                Email: email,
                Subject: subject,
                Message: message
            }]);

        if (error) {
            console.error(error);
            formStatus.textContent = "Une erreur est survenue. Réessaie plus tard.";
            formStatus.style.color = "#ff004f";
        } else {
            formStatus.textContent = "Message envoyé avec succès, merci !";
            formStatus.style.color = "#0ef";
            contactForm.reset();
        }
    });
}
