/**
 * ========================================
 * PORTFOLIO BTS - SCRIPT PRINCIPAL
 * ========================================
 * 
 * Ce fichier gère l'interactivité complète du portfolio :
 * 1. Navigation par carousel (menu latéral avec sections)
 * 2. Galerie d'images modale avec zoom/navigation
 * 3. Barres de compétences animées au scroll
 * 4. Effets visuels (header réduit, lettres aléatoires)
 * 5. Carte Leaflet pour localisation
 * 
 * GUIDE RAPIDE D'AJUSTEMENTS COURANTS :
 * ─────────────────────────────────────
 * 
 * ✏️ Modifier la vitesse du carousel :
 *    → Chercher : "transform: translateX("
 *    → Ajuster la valeur translateX en CSS ou JavaScript
 * 
 * ✏️ Changer les couleurs des barres de compétence :
 *    → Aller dans style.css → chercher ".progress-fill"
 *    → Modifier : background: linear-gradient(...)
 * 
 * ✏️ Accélérer/ralentir l'animation des barres :
 *    → Chercher : "const duration = 800;" (ligne ~330)
 *    → 800 = 0.8 secondes. Réduire pour accélérer, augmenter pour ralentir
 * 
 * ✏️ Changer le seuil de scroll pour animer les barres :
 *    → Chercher : "threshold: [0.2]"
 *    → 0.2 = quand 20% visible. 0 = immédiatement, 1 = quand 100% visible
 * 
 * ✏️ Réduire le header plus tôt/tard au scroll :
 *    → Chercher : "if (currentScroll > 50)" (ligne ~265)
 *    → 50 = pixels. Augmenter pour réduire plus tard, diminuer pour plus tôt
 * 
 * ✏️ Modifier l'effet de lettres aléatoires (vitesse/durée) :
 *    → Chercher : "randomLetters(greet, 1000, 40);" (ligne ~285)
 *    → Format : randomLetters(element, duration_ms, interval_ms)
 *    → 1000 = 1 seconde, 40 = update tous les 40ms
 * 
 * ✏️ Ajouter/enlever des sections du carousel :
 *    → Chercher : "const sections = ['accueil', 'competences', ...];" (ligne ~2)
 *    → Ajouter/supprimer les noms de section (doivent correspondre aux IDs HTML)
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * STRUCTURE DU FICHIER :
 * ─────────────────────
 * 1. Carousel Navigation (lignes 1-115)
 *    - Gère le menu latéral qui suit le scroll
 *    - createButtons(), updateCarousel(), moveCarousel()
 * 
 * 2. Event Listeners de Base (lignes 115-165)
 *    - load : initialise le carousel
 *    - scroll : synchronise le carousel avec la section active
 * 
 * 3. Galerie Modale (lignes 167-213)
 *    - Clic sur image → affiche en modal fullscreen
 *    - Boutons prev/next pour naviguer
 *    - Fonctions : openModal(), closeModal(), showPrev(), showNext()
 * 
 * 4. Zoom sur Images (lignes 215-245)
 *    - Clic sur image modale → zoom 1.5x
 *    - Toggle isZoomed
 * 
 * 5. Bouton "Retour Haut" (ligne 247)
 *    - Visible sur mobile seulement
 *    - Scroll fluide vers le haut
 * 
 * 6. Header Réduit au Scroll (lignes 255-280)
 *    - Au scroll > 50px : ajoute classe .scrolled
 *    - Réduit hauteur header et police du titre
 * 
 * 7. Écran de Chargement (lignes 287-297)
 *    - Spinner qui s'efface après 500ms
 * 
 * 8. Barres de Compétence (lignes 299-405)
 *    - Animation progressive 0% → pourcentage
 *    - Déclenchée au scroll avec IntersectionObserver
 *    - Durée 800ms, linéaire
 * 
 * 9. Carte Leaflet (lignes 407-455)
 *    - Intégration OpenStreetMap
 *    - Marqueurs et lignes de trajet
 * 
 * 10. Effet Lettres Aléatoires (lignes 457-500)
 *     - Animation sur greeting "Bonjour"
 *     - Dure 1000ms, 40ms par frame
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 */

//console.log("test");
//alert("test");

//========================================
// SECTION CAROUSEL (Menu latéral déroulant)
//========================================

// Définit chaque section de la page avec son ID et label
// À modifier : ajouter/retirer des sections ici si besoin
const sections = [
  { id: "accueil", label: "Accueil" },
  { id: "competences", label: "Compétences" },
  { id: "parcours", label: "Parcours" },
  { id: "experiences", label: "Expériences" },
  { id: "veille", label: "Veille" },
  { id: "cv", label: "CV" },
  { id: "contact", label: "Contact" }
];

// Récupère l'élément conteneur du carousel
const carouselTrack = document.getElementById("carousel-track");

// Index actuel du bouton sélectionné dans le carousel
let currentIndex = 0;

// Nombre total de sections
const totalItems = sections.length;

// Hauteur approximative d'un bouton + espacement (à ajuster si les boutons changent de taille)
const buttonHeight = 90;

// Récupère la hauteur visible du carousel (zone où les boutons s'affichent)
function getCarouselViewportHeight() {
  const wrapper = document.querySelector(".carousel-wrapper");
  return wrapper ? wrapper.clientHeight : 600; // fallback de 600px si non trouvé
}

// Crée les boutons du carousel (avec copie multiple pour effet infini)
function createButtons() {
  // Crée 5 séries de boutons (cycle -2 à 2) pour simuler une boucle infinie
  for (let cycle = -2; cycle <= 2; cycle++) {
    sections.forEach((section, index) => {
      const button = document.createElement("button");
      button.className = "carousel-button";
      button.textContent = section.label;
      button.dataset.index = index;
      
      // Au clic sur un bouton : met à jour l'index et scroll vers la section
      button.onclick = () => {
        currentIndex = index;
        updateCarousel();
        
        if (section.id === "accueil") {
          // Cas spécial : Accueil → scroll vers le haut
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          // Autres sections → scroll vers la section correspondante
          document.getElementById(section.id).scrollIntoView({ behavior: "smooth" });
        }
      };
      
      carouselTrack.appendChild(button);
    });
  }
}

// Met à jour l'apparence du carousel : position des boutons et opacité
function updateCarousel() {
  const buttons = carouselTrack.querySelectorAll(".carousel-button");
  
  // Décalage pour centrer le bouton actif dans le viewport
  const cycleOffset = totalItems * 2.05;
  
  // Hauteur visible du carousel
  const viewportHeight = getCarouselViewportHeight();
  
  // Position Y : calcule où centrer le bouton actif
  const centerPosition = (viewportHeight / 2) - (buttonHeight / 2);
  
  // Applique la transformation (translateY) pour positionner les boutons
  const translateY = centerPosition - (buttonHeight * (currentIndex + cycleOffset));
  carouselTrack.style.transform = `translateY(${translateY}px)`;
  
  // Ajuste l'opacité et la taille de chaque bouton selon sa distance au bouton actif
  buttons.forEach((btn, i) => {
    const idx = i % totalItems; // Index original du bouton
    let distance = Math.abs(idx - currentIndex); // Distance à l'index actif
    
    // Ajuste la distance en tenant compte de la boucle
    if (distance > totalItems / 2) distance = totalItems - distance;
    
    // Applique les styles selon la distance
    if (idx === currentIndex) {
      // Bouton actif : grand et opaque
      btn.classList.add("active");
      btn.style.opacity = 1;
      btn.style.transform = "scale(1.2)";
      btn.style.pointerEvents = "auto";
    } else if (distance <= 1) {
      // Proches (distance 1) : moyens et semi-opaque
      btn.classList.remove("active");
      btn.style.opacity = 0.5;
      btn.style.transform = "scale(1)";
      btn.style.pointerEvents = "auto";
    } else if (distance <= 2) {
      // Moyennement loin (distance 2) : petits et très semi-opaque
      btn.classList.remove("active");
      btn.style.opacity = 0.4;
      btn.style.transform = "scale(0.9)";
      btn.style.pointerEvents = "auto";
    } else {
      // Loin : très petits et à peine visibles
      btn.classList.remove("active");
      btn.style.opacity = 0.2;
      btn.style.transform = "scale(0.8)";
      btn.style.pointerEvents = "auto";
    }
  });
}

// Déplace le carousel dans une direction (1 = bas, -1 = haut)
function moveCarousel(direction) {
  currentIndex = (currentIndex + direction + totalItems) % totalItems;
  updateCarousel();
  const targetSection = sections[currentIndex];
  document.getElementById(targetSection.id).scrollIntoView({ behavior: "smooth" });
}

//========================================
// EVENT LISTENERS DE BASE
//========================================

// Au chargement de la page : initialise les boutons et positionne le carousel
window.addEventListener("load", () => {
  window.scrollTo(0, 0); // Scroll vers le haut
  createButtons(); // Génère tous les boutons
  currentIndex = 0; // Commence sur "Accueil"
  updateCarousel(); // Met à jour l'affichage
});

// À chaque scroll : met à jour le carousel pour suivre la section visible
window.addEventListener("scroll", () => {
  let closestIndex = 0;
  let minDistance = Infinity;

  // Trouve la section la plus proche du haut de l'écran
  sections.forEach((section, index) => {
    const el = document.getElementById(section.id);
    const rect = el.getBoundingClientRect();
    // Distance entre le haut de la section et 1/5 en haut de l'écran
    const distance = Math.abs(rect.top - window.innerHeight / 5);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  // Met à jour le carousel si la section la plus proche a changé
  if (closestIndex !== currentIndex) {
    currentIndex = closestIndex;
    updateCarousel();
  }
});

//========================================
// GESTION DES MODALES IMAGES (galerie cliquable)
//========================================

// Récupère les éléments de la modale
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Récupère toutes les images cliquables
const images = [...document.querySelectorAll(".clickable-img")];
let modalCurrentIndex = 0;

// Ouvre la modale et affiche l'image
function openModal(index) {
    currentIndex = index;
    modal.style.display = "block";
    modalImg.src = images[currentIndex].src;
}

// Ferme la modale
function closeModal() {
    modal.style.display = "none";
}

// Affiche l'image précédente
function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
}

// Affiche l'image suivante
function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].src;
}

// Au clic sur une image : ouvre la modale
images.forEach((img, idx) => {
    img.addEventListener("click", () => openModal(idx));
});

// Ferme la modale au clic sur le bouton fermer
closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
});

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
});

//gérer zoom + drag (clic-glissé pour déplacer l’image zoomée)

let isZoomed = false;
let isDragging = false;
let startX, startY, currentX = 0, currentY = 0;

modalImg.style.transform = "translate(0px, 0px) scale(1)";

modalImg.addEventListener('click', () => {
	
	if (!isZoomed) {
		isZoomed = true;
		modalImg.classList.add('zoomed');	
		modalImg.style.transform = 'translate(0px,100px) scale(1.5)'; // zoom 2x
		console.log
	} else {
		isZoomed = false;
		isDragging = false;
		modalImg.classList.remove('zoomed');		
		modalImg.style.transform = `translate(0px, 0px) scale(1)`;
		currentX = 0;
		currentY = 0;
	}
});

//========================================
// BOUTON "RETOUR VERS LE HAUT" (mobile)
//========================================

// Au clic : scroll fluide vers le haut
document.getElementById('scrollToTopBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

//========================================
// HEADER RÉDUIT AU SCROLL
//========================================

// Récupère l'élément header
const headerElement = document.querySelector('header');
let lastScrollTop = 0;

// À chaque scroll : réduit le header si on descend de plus de 50px
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
  if (currentScroll > 50) {
    // Utilisateur a scrollé → header devient petit
    headerElement.classList.add('scrolled');
  } else {
    // Utilisateur remonte → header revient à la taille normale
    headerElement.classList.remove('scrolled');
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

//========================================
// ÉCRAN DE CHARGEMENT (loader/spinner)
//========================================

// Au chargement : affiche le spinner, puis le cache après 500ms
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0"; // transparent
  setTimeout(() => {
    loader.style.display = "none"; // caché
  }, 500);
});

//// BARRES DE PROGRESSION (horizontal) et EFFET DE TEXTE ALÉATOIRE

/**
 * SECTION: Barres de Progression + Effet Greeting Aléatoire
 * 
 * Au chargement de la page :
 * 1. Lance l'effet de lettres aléatoires sur le greeting ("Bonjour")
 * 2. Crée les barres de progression horizontales pour chaque compétence
 * 3. Attache des observateurs pour animer les barres au scroll
 * 
 * À AJUSTER :
 * - Durée d'animation : changer 'duration = 800' pour accélérer/ralentir
 * - Seuil d'activation : changer 'threshold: [0.2]' pour déclencher plus tôt/tard au scroll
 * - Couleur des barres : éditer '.progress-fill' dans style.css
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Étape 1 : Greeting avec lettres aléatoires =====
  // Applique l'effet au header h1 (texte + image préservée)
  const headerTitle = document.querySelector('header h1#randomletter');
  if (headerTitle) randomLetters(headerTitle, 400, 45);
  
  // Applique l'effet au "Bonjour" dans la section accueil
  const greet = document.querySelector('.p1 #randomletter');
  if (greet) randomLetters(greet, 700, 60);

  // ===== Étape 2 : Préparation des barres de progression =====
  const containers = document.querySelectorAll('.progress-circle');

  // Pour chaque conteneur de compétence : crée la structure HTML de la barre
  containers.forEach(container => {
    // Récupère le pourcentage (ex: "85") depuis l'attribut HTML data-percent
    const percent = Math.max(0, Math.min(100, parseInt(container.getAttribute('data-percent')) || 0));
    container.dataset.targetPercent = percent;

    // Crée le conteneur de la barre (fond gris clair)
    const track = document.createElement('div');
    track.className = 'progress-track';
    const fill = document.createElement('div');
    fill.className = 'progress-fill'; // la barre qui s'animate (bleu gradient)
    fill.style.width = '0%'; // commence à 0%, puis animation vers le pourcentage
    track.appendChild(fill);

    // Crée le label du pourcentage (ex: "0%", puis "85%")
    const label = document.createElement('div');
    label.className = 'progress-percent';
    label.textContent = '0%';

    // Ajoute la barre et le label au conteneur (après le titre de compétence existant)
    container.appendChild(track);
    container.appendChild(label);
  });

  // ===== Étape 3 : Fonction d'animation des barres =====
  /**
   * animateFill(container)
   * Anime la largeur de la barre de progression de 0% → pourcentage cible
   * en 800ms avec une courbe linéaire.
   * 
   * Utilise requestAnimationFrame pour une animation fluide.
   * Ne lance qu'une fois par conteneur (vérification data-animated).
   */
  function animateFill(container) {
    if (container.dataset.animated === 'true') return; // déjà animée, pas besoin de relancer

    const target = parseInt(container.dataset.targetPercent || '0', 10);
    const fill = container.querySelector('.progress-fill');
    const label = container.querySelector('.progress-percent');
    if (!fill || !label) return; // éléments manquants, abandon

    const duration = 800; // Durée en ms (À AJUSTER pour accélérer/ralentir)
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start; // temps écoulé depuis le démarrage
      const progress = Math.min(1, elapsed / duration); // progression 0 → 1
      const value = Math.round(progress * target); // pourcentage actuel (ex: 42%)
      fill.style.width = value + '%';
      label.textContent = value + '%';

      if (progress < 1) {
        requestAnimationFrame(frame); // appelle le prochain frame
      } else {
        container.dataset.animated = 'true'; // marque comme animée
      }
    }

    requestAnimationFrame(frame);
  }

  // ===== Étape 4 : Observateur de scroll pour déclencher l'animation =====
  /**
   * IntersectionObserver :
   * Détecte quand la section #competences devient visible à l'écran.
   * Quand le seuil est atteint, lance l'animation de TOUTES les barres.
   * 
   * À AJUSTER :
   * - 'threshold: [0.2]' = déclenche quand 20% de la section est visible
   *   • 0.0 = dès que la section rentre dans le viewport
   *   • 0.5 = quand 50% est visible
   *   • 1.0 = quand 100% est visible
   */
  const section = document.getElementById('competences');
  if (section && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          // Section visible → anime toutes les barres
          containers.forEach(c => animateFill(c));
          observer.disconnect(); // détache l'observateur (animation lancée une fois)
        }
      });
    }, { threshold: [0.2] }); // À AJUSTER : changez 0.2 pour un autre seuil
    obs.observe(section);
  } else {
    // FALLBACK (navigateurs sans IntersectionObserver) : anime au scroll
    function onScrollCheck() {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        containers.forEach(c => animateFill(c));
        window.removeEventListener('scroll', onScrollCheck);
      }
    }
    window.addEventListener('scroll', onScrollCheck);
    // also check immediately in case already visible
    if (section && section.getBoundingClientRect().top < window.innerHeight * 0.8) {
      containers.forEach(c => animateFill(c));
      window.removeEventListener('scroll', onScrollCheck);
    }
  }
});

//========================================
// CARTE LEAFLET (Localisation des stages)
//========================================

/**
 * SECTION: Intégration Leaflet.js pour affichage de carte interactive
 * 
 * Cette section initialise une carte OpenStreetMap avec :
 * - Vue centrée sur Nérac (44.20000, 0.63333) au zoom 13
 * - Marqueur personnalisé pour les emplacements
 * - Fonction pour créer des marqueurs (CreateMarker)
 * - Fonction pour tracer une ligne de trajet (CalculDistance)
 * 
 * À UTILISER :
 * 1. CreateMarker(latitude, longitude) → place un marqueur sur la carte
 *    Exemple : CreateMarker(44.20, 0.63); → marqueur à Nérac
 * 
 * 2. CalculDistance() → trace une ligne entre deux points
 *    À modifier : changez le tableau 'latlngsLine' pour changer la ligne
 * 
 * À AJUSTER :
 * - Latitude/Longitude initiale : modifiez setView([44.20000, 0.63333], 13)
 * - Image du marqueur : remplacez 'marker.png' par le chemin de votre image
 * - Couleur de la ligne : changez 'color: blue' dans CalculDistance
 */

// Crée la carte et la centre sur Nérac
var map = L.map('map').setView([44.20000, 0.63333], 13);

// Définit l'icône personnalisée du marqueur
var myIcon = L.icon({
  iconUrl: 'marker.png',
  iconSize: [40, 40]
});

// Ajoute la couche de tuiles OpenStreetMap (fond de carte)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

/**
 * CreateMarker(x, y)
 * Crée et ajoute un marqueur sur la carte à la position (latitude, longitude).
 * La carte se recentre automatiquement sur le marqueur.
 */
function CreateMarker(x,y){
  var marker = L.marker([x,y],{icon: myIcon});
  var latLngs = [marker.getLatLng()];
  var markerBounds = L.latLngBounds(latLngs);
  
  marker.addTo(map);
  map.fitBounds(markerBounds);
}

/**
 * CalculDistance()
 * Trace une ligne entre deux points (Nérac → Paris) et recentre la vue.
 * À MODIFIER :
 * - Changez les coordonnées dans 'latlngsLine' pour tracer une autre ligne
 * - Modifiez 'color: blue' pour changer la couleur de la ligne
 * - Changez setView pour recentrer ailleurs
 */
function CalculDistance(){
  var latlngsLine =[
    [44.20219901112438,0.613596432464637],  // Nérac
    [48.84435810976229, 2.585499263256165],  // Paris
  ];
  var Line = L.polyline(latlngsLine, {color: 'blue'}).addTo(map);
  
  map.setView([46.79813189033166, 2.509669753820759], 6);
}

//========================================
// EFFET DE LETTRES ALÉATOIRES (greeting)
//========================================

/**
 * FONCTION: randomLetters(element, duration, speed)
 * Crée un effet d'animation où le texte de l'élément se transforme
 * en lettres/chiffres aléatoires pendant une courte durée, puis revient au texte original.
 * 
 * ✨ SPÉCIAL : Effet TYPEWRITER - Les caractères s'affichent progressivement
 *             pendant que l'animation aléatoire est active.
 *             Si l'élément contient des <img>, elles sont préservées intactes.
 * 
 * PARAMÈTRES :
 * - element : l'élément DOM contenant le texte à animer (ex: document.querySelector('header h1'))
 * - duration : durée totale de l'effet en millisecondes (défaut : 1000ms = 1s)
 * - speed : interval entre chaque mise à jour en ms (défaut : 40ms = 25 updates/sec)
 * 
 * EXEMPLES D'UTILISATION :
 * randomLetters(headerElement);                     → durée 1s, vitesse normale
 * randomLetters(greetElement, 2000, 30);           → durée 2s, plus rapide (30ms par update)
 * randomLetters(greetElement, 500, 100);           → durée 0.5s, plus lent (100ms par update)
 * 
 * À AJUSTER :
 * - Pour un effet plus lent : augmentez 'speed' (ex: 80ms)
 * - Pour un effet plus rapide : diminuez 'speed' (ex: 20ms)
 * - Pour rallonger la durée : augmentez 'duration' (ex: 2000ms)
 * - Pour ajouter d'autres caractères : modifiez la chaîne 'letters'
 */
function randomLetters(element, duration = 1000, speed = 40) {
  if (!element) return; // Sécurité : vérifie que l'élément existe
  
  // Sauvegarde le HTML original (texte + images)
  const originalHTML = element.innerHTML;
  
  // Extrait UNIQUEMENT le texte (en excluant les balises img)
  let finalText = '';
  element.childNodes.forEach(node => {
    if (node.nodeType === 3) { // Nœud texte
      finalText += node.textContent.trim();
    }
  });
  
  // Si aucun texte trouvé, essaie textContent (fallback)
  if (!finalText) finalText = element.textContent.trim();
  
  // Valeurs minimales pour éviter les bugs
  duration = Math.max(10, duration);
  speed = Math.max(1, speed);
  
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#!?";
  let interval;
  let startTime = performance.now();
  let frameCount = 0;

  // Lance une boucle qui met à jour le texte avec des lettres aléatoires
  interval = setInterval(() => {
    const elapsed = performance.now() - startTime;
    frameCount++;
    
    // Calcule la progression (0 à 1)
    const progress = Math.min(1, elapsed / duration);
    
    // Calcule le nombre de caractères à afficher (effet typewriter)
    const charsToShow = Math.floor(progress * finalText.length);
    
    let randomText = "";
    // Génère du texte aléatoire pour TOUS les caractères
    for (let i = 0; i < finalText.length; i++) {
      randomText += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Mélange : affiche les caractères aléatoires jusqu'à charsToShow, puis des espaces/caractères vides
    let displayText = "";
    for (let i = 0; i < finalText.length; i++) {
      if (i < charsToShow) {
        // Affiche le caractère aléatoire
        displayText += randomText[i];
      } else {
        // Affiche un espace (caractère invisible) pour les caractères pas encore affichés
        displayText += " ";
      }
    }
    
    // Reconstruit le contenu en remplaçant seulement le texte
    element.innerHTML = '';
    let textIndex = 0;
    const originalClone = document.createElement('div');
    originalClone.innerHTML = originalHTML;
    
    // Recréé l'arborescence en remplaçant le texte par du texte avec typewriter
    originalClone.childNodes.forEach(node => {
      if (node.nodeType === 3) { // Nœud texte
        const length = node.textContent.trim().length;
        const displayPart = displayText.substring(textIndex, textIndex + length);
        element.appendChild(document.createTextNode(displayPart));
        textIndex += length;
      } else {
        // Copie les éléments (comme les images)
        element.appendChild(node.cloneNode(true));
      }
    });
    
    // Arrête après 'duration' ms écoulées
    if (frameCount > 1 && elapsed > duration) {
      clearInterval(interval);
      element.innerHTML = originalHTML; // Restaure le HTML original (texte + images)
    }
  }, speed);
}




