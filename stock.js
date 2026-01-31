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
            if (ligne.trim() === "") continue;

            // ATTENTION : Si vos produits ne s'affichent toujours pas, 
            // remplacez le ',' ci-dessous par ';'
            const colonnes = ligne.split(','); 
            const [sku, ean, nom, famille, prix_ht, tva, stock] = colonnes;
            
            const urlImageFinale = await determinerImage(ean ? ean.trim() : "");
            
            // Sécurité pour le calcul du prix
            const pHT = parseFloat(prix_ht) || 0;
            const tvaVal = parseFloat(tva) || 0;
            const prixTTC = pHT * (1 + tvaVal);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${urlImageFinale}" onclick="agrandirImage('${urlImageFinale}')" style="width:50px; height:50px; object-fit:cover; cursor:pointer;"></td>
                <td>${ean || ''}</td>
                <td><strong>${nom || 'Sans nom'}</strong><br><small>${famille || ''}</small></td>
                <td>${prixTTC.toFixed(2)} €</td>
                <td>${stock || 0}</td>
                <td><input type="number" class="qte-input" min="0" max="${stock}" value="0" data-prix="${prixTTC}"></td>
            `;
            corpsTableau.appendChild(tr);
        }
    } catch (error) {
        console.error("Erreur lors du chargement du CSV :", error);
    }
}

chargerProduits();
