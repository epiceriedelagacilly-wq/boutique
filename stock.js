async function determinerImage(ean) {
    const dossierImages = "images/";
    const cheminLocal = dossierImages + ean + ".jpg";
    try {
        const testLocal = await fetch(cheminLocal, { method: 'HEAD' });
        if (testLocal.ok) return cheminLocal;

        const apiResp = await fetch(`https://world.openfoodfacts.org/api/v0/product/${ean}.json`);
        const apiData = await apiResp.json();
        if (apiData.status === 1 && apiData.product.image_url) return apiData.product.image_url;
    } catch (e) {
        console.warn("Image non trouvée pour : " + ean);
    }
    return "images/non-disponible.jpg"; 
}

async function chargerProduits() {
    try {
        const reponse = await fetch('produits.csv');
        const texte = await reponse.text();
        const lignes = texte.split('\n').slice(1);
        const corpsTableau = document.getElementById('corpsTableau');

        if (!corpsTableau) return;
        corpsTableau.innerHTML = "";

        for (const ligne of lignes) {
            const l = ligne.trim();
            if (l === "") continue;

            const col = l.split(';'); 
            
            const ean     = col[1] ? col[1].trim() : "";
            const nom     = col[2] ? col[2].trim() : "Produit";
            const famille = col[3] ? col[3].trim() : "";
            
            // Sécurité : on remplace la virgule par un point avant de transformer en nombre
            const pHT     = parseFloat(col[4].toString().replace(',', '.')) || 0;
            const tvaValeur = parseFloat(col[5].toString().replace(',', '.')) || 0;
            const stock   = col[6] ? col[6].trim() : 0;
            
            // Calcul TTC (gère si la TVA est 0.20 ou 20)
            const tauxTVA = tvaValeur > 1 ? tvaValeur / 100 : tvaValeur;
            const prixTTC = pHT * (1 + tauxTVA);

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
    } catch (e) {
        console.error("Erreur de chargement :", e);
    }
} // <--- L'accolade qui manquait ici !

chargerProduits();