document.getElementById('inputRecherche').addEventListener('input', function(e) {
    const recherche = e.target.value.toLowerCase();
    const lignes = document.querySelectorAll("#corpsTableau tr");

    lignes.forEach(ligne => {
        const contenuLigne = ligne.textContent.toLowerCase();
        ligne.style.display = contenuLigne.includes(recherche) ? "" : "none";
    });
});