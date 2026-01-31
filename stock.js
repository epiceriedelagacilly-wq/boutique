async function determinerImage(ean) {
    const dossierImages = "images/";
    const extension = ".jpg";
    const cheminLocal = dossierImages + ean + extension;

    try {
        // 1. On cherche d'abord dans VOTRE dossier images/
        const testLocal = await fetch(cheminLocal, { method: 'HEAD' });
        if (testLocal.ok) return cheminLocal;

        // 2. Si non trouvé, on cherche sur Open Food Facts
        const apiResp = await fetch(`https://world.openfoodfacts.org/api/v0/product/${ean}.json`);
        const apiData = await apiResp.json();
        
        if (apiData.status === 1 && apiData.product.image_url) {
            return apiData.product.image_url;
        }
    } catch (e) {
        console.warn("Erreur pour l'EAN : " + ean);
    }

    // 3. Si rien ne marche, on met une image vide ou une erreur
    return "images/non-disponible.jpg"; 
}

async function chargerProduits() {
    const reponse = await fetch('produits.csv');
    const texte = await reponse.text();
    const lignes = texte.split('\n').slice(1);
    const corpsTableau = document.getElementById('corpsTableau');

    for (const ligne of lignes) {
        if (ligne.trim() === "") continue;

        // On sépare les colonnes (vérifiez bien si c'est une virgule ou un point-virgule)
        const colonnes = ligne.split(',');
        const [sku, ean, nom, famille, prix_ht, tva, stock] = colonnes;
        
        const urlImageFinale = await determinerImage(ean.trim());
        const prixTTC = parseFloat(prix_ht) * (1 + parseFloat(tva));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${urlImageFinale}" onclick="agrandirImage('${urlImageFinale}')" style="width:50px; height:50px; object-fit:cover; cursor:pointer;"></td>
            <td>${ean}</td>
            <td><strong>${nom}</strong><br><small>${famille}</small></td>
            <td>${prixTTC.toFixed(2)} €</td>
            <td>${stock}</td>
            <td><input type="number" class="qte-input" min="0" max="${stock}" value="0" data-prix="${prixTTC}"></td>
        `;
        corpsTableau.appendChild(tr);
    }
}

chargerProduits();