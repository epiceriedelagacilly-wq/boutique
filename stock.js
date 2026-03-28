/* ===========================================
   stock.js – Clic & Collect prototype
   Gère produits, panier et images par code EAN
=========================================== */

/* === CONFIGURATION === */
const fallbackImage = "https://site-specialise.com/images/default.jpg";

/* === PRODUITS === */
const products = [
  { sku: "PANZ_SPAG1K", nom: "PÂTES SPAGHETTI PANZANI 1KG", prix: 2.99, stock: 9, code_barre: "3038350025005" },
  { sku: "CN_CAFE250", nom: "CARTE NOIRE MOULU 250 G", prix: 7.95, stock: 12, code_barre: "8000070200289" },
  { sku: "BF_PT12", nom: "12 ROULEAUX PAPIER TOILETTE BF", prix: 3.75, stock: 4, code_barre: "3258561668031" }
];

/* === FONCTION POUR OBTENIR LE CHEMIN IMAGE === */
function getImage(p) {
  return `images/${p.code_barre}.jpg`;
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

/* === SOUMISSION VIA FORMSUBMIT === */
function submitOrder() {
  updateCart();

  const clientName = document.getElementById("clientName").value.trim();
  const total = parseFloat(document.getElementById("total").textContent);
  const panier = document.getElementById("cartContents").textContent;

  if (!clientName) {
    alert("Veuillez entrer votre nom complet.");
    return;
  }
  if (total <= 0) {
    alert("Votre panier est vide !");
    return;
  }

  document.getElementById("hiddenNom").value = clientName;
  document.getElementById("hiddenPanier").value = panier;
  document.getElementById("hiddenTotal").value = total.toFixed(2) + " €";

  document.getElementById("formsubmitForm").submit();
}

/* === INITIALISATION === */
initProducts();
updateCart();
