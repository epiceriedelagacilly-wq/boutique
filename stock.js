/* ===========================================
   stock.js – Clic & Collect prototype
   Gère produits, panier et images par code EAN
=========================================== */

/* === CONFIGURATION === */
const fallbackImage = "https://site-specialise.com/images/default.jpg"; // fallback global si image locale non trouvée

/* === PRODUITS EXEMPLE ===
   - code_barre = EAN
   - prix = nombre
   - stock = nombre
   Tu peux ajouter autant de produits que nécessaire.
*/
const products = [
  { sku: "PANZ_SPAG1K", nom: "PÂTES SPAGHETTI PANZANI 1KG", prix: 2.99, stock: 9, code_barre: "3038350025005" },
  { sku: "CN_CAFE250", nom: "CARTE NOIRE MOULU 250 G", prix: 7.95, stock: 12, code_barre: "8000070200289" },
  { sku: "BF_PT12", nom: "12 ROULEAUX PAPIER TOILETTE BF", prix: 3.75, stock: 4, code_barre: "3258561668031" }
];

/* === FONCTION POUR OBTENIR LE CHEMIN IMAGE === */
function getImage(p) {
  const localPath = `images/${p.code_barre}.jpg`;  // chemin local (tests)
  return localPath; // fallback géré dans onerror
}

/* === INITIALISATION DU TABLEAU PRODUITS === */
function initProducts() {
  const tbody = document.querySelector("#prodTable tbody");
  products.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="${getImage(p)}" alt="${p.nom}" width="50"
             onerror="this.onerror=null; this.src='${fallbackImage}';">
        ${p.nom}
      </td>
      <td>€${p.prix.toFixed(2)}</td>
      <td id="stock-${i}">${p.stock}</td>
      <td><input type="number" min="0" value="0" data-index="${i}" onchange="updateCart()" /></td>
    `;
    tbody.appendChild(tr);
  });
}

/* === METTRE À JOUR LE PANIER === */
function updateCart() {
  const inputs = document.querySelectorAll('#prodTable input[type="number"]');
  let total = 0;
  const lines = [];
  let stockProblem = false;

  inputs.forEach(inp => {
    const idx = parseInt(inp.dataset.index, 10);
    const qty = Math.max(0, parseInt(inp.value) || 0);
    const p = products[idx];

    if (qty > p.stock) {
      document.getElementById(`stock-${idx}`).innerHTML = `<span class="out">${p.stock} (max)</span>`;
      stockProblem = true;
    } else {
      document.getElementById(`stock-${idx}`).textContent = p.stock;
    }

    if (qty > 0) {
      const lineTotal = qty * Number(p.prix);
      total += lineTotal;
      lines.push(`${p.sku} | ${p.nom} | qté: ${qty} | €${lineTotal.toFixed(2)}`);
    }
  });

  document.getElementById("cartContents").textContent = lines.length ? lines.join("\n") : "Aucun produit sélectionné";
  document.getElementById("total").textContent = total.toFixed(2);
  document.getElementById("sendBtn").disabled = stockProblem || total <= 0;
}

/* === GÉNÉRATION D'UN CHAMP CACHÉ POUR FORM SUBMIT === */
document.getElementById("orderForm").addEventListener("submit", function(e){
  updateCart();
  if(document.getElementById("total").textContent <= 0){
    e.preventDefault();
    alert("Votre panier est vide !");
    return false;
  }

  // Crée ou met à jour le champ caché pour envoyer le panier
  let cartField = document.querySelector('input[name="Panier"]');
  if(!cartField){
    cartField = document.createElement("input");
    cartField.type = "hidden";
    cartField.name = "Panier";
    this.appendChild(cartField);
  }
  cartField.value = document.getElementById("cartContents").textContent;
});

/* === INITIALISATION === */
initProducts();
updateCart();
