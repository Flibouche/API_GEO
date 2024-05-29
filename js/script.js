// Sélectionne l'élément HTML avec la classe "cp"
const inputCP = document.querySelector(".cp");
// Sélectionne l'élément HTML avec la classe "ville"
const selectVille = document.querySelector(".ville");
// Déclaration de la variable pour la carte Leaflet
let map; 

// Ajoute un écouteur d'événement "input" (pendant la saisie) au champ de code postal
inputCP.addEventListener("input", () => {
  // Récupère la valeur entrée dans le champ de code postal
  let value = inputCP.value;
  // Vide le contenu actuel de la liste de sélection de ville
  selectVille.innerText = null;
  // Effectue une requête fetch vers l'API de géolocalisation avec le code postal saisi
  fetch(
    `https://geo.api.gouv.fr/communes?codePostal=${value}&fields=code,nom,departement,codeDepartement,codeRegion,region,centre,codesPostaux&format=json`
  )
    // Convertit la réponse ne format JSON
    .then((response) => response.json())
    // Une fois que les données JSON sont disponibles
    .then((data) => {
      // Affiche les données dans la console (pour debug si besoin)
      console.log(data);
      // Parcours chaque objet "ville" dans les données récupérées
      data.forEach((ville) => {
        // Crée un nouvel élément d'option HTML
        let option = document.createElement("option");
        // Définit la valeur de l'option comme le code de la ville
        option.value = ville.code;
        // Définit le texte affiché de l'option comme le nom de la ville
        option.innerHTML = ville.nom;
        // Ajoute l'option à la liste de sélection de ville
        selectVille.appendChild(option);
      });

      // Récupération des coordonnées pour centrer la carte
      const coordinate = [
        data[0].centre.coordinates[1], // Latitude
        data[0].centre.coordinates[0], // Longitude
      ];

      // Vérifie si la carte existe déjà
      if (!map) {
        // Crée une nouvelle carte Leaflet et la centre sur les coordonnées récupérées
        map = L.map("map").setView(coordinate, 12);
        // Ajoute une couche de tuiles OpenStreetMap à la carte
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19, // Zoom maximum autorisé
          attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
      } else {
        // Si la carte existe déjà, met à jour sa vue en se centrant sur les nouvelles coordonnées
        map.setView(coordinate, 12);
      }
    });
});