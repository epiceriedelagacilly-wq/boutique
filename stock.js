async function determinerImage(ean) {
    const dossierImages = "images/";
    const extension = ".jpg";
    const cheminLocal = dossierImages + ean + extension;

    try {
        const testLocal = await fetch(cheminLocal, { method: 'HEAD' });
        if (testLocal.ok) return cheminLocal;

        const apiResp = await fetch(`https://world.openfoodfacts.org/api/v0/product/${ean}.json`);
        const apiData = await apiResp.json();
        
        if (apiData.status === 1 && apiData.product.image_url) {
            return apiData.product.image_url;
        }
    } catch (e) {
        console.warn("Erreur image pour l'EAN : " + ean);
    }
    return "images/non-disponible.jpg"; 
}

// Fonction pour éviter l'erreur au clic sur l'image
function agrandirImage(url) {
    window.open(url, '_blank');
}

async function chargerProduits() {
    try {
        const reponse = await fetch('produits.csv');
        const texte = await reponse.text();
        const lignes = texte.split('\n').slice(1);
        const corpsTableau = document.getElementById('corpsTableau');

        if (!corpsTableau) return; // Sécurité si l'élément n'existe pas

      for (const ligne of lignes) {
            const ligneNettoyée = ligne.trim();
            if (ligneNettoyée === "") continue;

            // On utilise le POINT-VIRGULE ici
            const col = ligneNettoyée.split(';'); 
            
            // On récupère les données (0, 1, 2...)
            const ean     = col[1] ? col[1].trim() : "";
            const nom     = col[2] ? col[2].trim() : "Produit sans nom";
            const famille = col[3] ? col[3].trim() : "";
            const pHT     = parseFloat(col[4]) || 0;
            const tva     = parseFloat(col[5]) || 0;
            const stock   = col[6] ? col[6].trim() : 0;
            
            const prixTTC = pHT * (1 + tva);
            const urlImage = await determinerImage(ean);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${urlImage}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;"></td>
                <td>${ean}</td>
                <td><strong>${nom}</strong><br><small>${famille}</small></td>
                <td>${prixTTC.toFixed(2)} €</td>
                <td>${stock}</td>
                <td><input type="number" class="qte-input" min="0" max="${stock}" value="0"></td>
            `;
            corpsTableau.appendChild(tr);
        }
}

chargerProduits();