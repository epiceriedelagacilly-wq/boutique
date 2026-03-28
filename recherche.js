/* recherche.js – Filtre les lignes du tableau produits */
document.getElementById('searchInput').addEventListener('input', function(e) {
    const recherche = e.target.value.toLowerCase();
    const lignes = document.querySelectorAll("#prodTable tbody tr");

    lignes.forEach(ligne => {
        const contenuLigne = ligne.textContent.toLowerCase();
        ligne.style.display = contenuLigne.includes(recherche) ? "" : "none";
    });
});
