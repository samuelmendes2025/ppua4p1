const JSON_API_URL = "https://samuelmendes2025.github.io/ppua4p1/mocks/find_all.json";
const IMAGE_BASE_PATH = "images/";
const cartCountSpan = document.getElementById("cart-count");
const productListDiv = document.getElementById("product-list");
const modalCartItemsDiv = document.getElementById("modal-cart-items");
const modalCartTotalSpan = document.getElementById("modal-cart-total");
const emptyCartMessage = document.getElementById("empty-cart-message");

const colorMap = {
  preto: "black",
  prata: "silver",
  azul: "blue",
  branco: "white",
  vermelho: "red",
  laranja: "orange",
  dourado: "gold",
  cinza: "gray",
};

let arrayCartItems = [];
let numberCartItems = 0;
let productsData = [];

function populateCartModal() {
  modalCartItemsDiv.innerHTML = ""; // Limpa o conteúdo anterior da modal
  let totalCartValue = 0;

  if (arrayCartItems.length === 0) {
    emptyCartMessage.style.display = "block"; // Mostra a mensagem de carrinho vazio
    modalCartItemsDiv.appendChild(emptyCartMessage);
    modalCartTotalSpan.textContent = "R$ 0,00";
    return;
  } else {
    emptyCartMessage.style.display = "none"; // Esconde a mensagem
  }

  // Contar a quantidade de cada produto no carrinho
  const cartProductInfo = {};
  arrayCartItems.forEach((product) => {
    const key = `${product.id}_${product.color}`;
    cartProductInfo[key] = cartProductInfo[key] ||
      0 || { quantity: product.quantity, color: product.color };
  });

  // Iterar sobre os produtos no carrinho e exibi-los
  for (const key in cartProductInfo) {
    const { quantity, color: selectedColorVariant } = cartProductInfo[key];
    const productId = key.split("_")[0];
    // Encontrar o produto correspondente nos dados carregados
    const product = productsData.find((p) => p.id === productId);

    if (product) {
      const subtotal = parseFloat(product.preco) * quantity;
      totalCartValue += subtotal;

      const cartItemHtml = cartProductItem(
        product,
        selectedColorVariant,
        quantity
      );
      modalCartItemsDiv.innerHTML += cartItemHtml;
    }
  }

  // Atualizar o total do carrinho na modal
  modalCartTotalSpan.textContent = `R$ ${totalCartValue.toFixed(2)}`;
}

function changeQuantity(targetItem, action) {
  // Encontra o índice da primeira ocorrência do item para remover
  const itemIndex = arrayCartItems.findIndex(
    (item) => item.id === targetItem.id && item.color === targetItem.color
  );
  if (action === "increase") {
    arrayCartItems[itemIndex].quantity++;
    numberCartItems++;
  } else if (action === "decrease") {
    if (arrayCartItems[itemIndex].quantity === 1) {
      console.log("Removendo item sem unidades!");
      arrayCartItems.splice(itemIndex, 1); // Remove uma instância do item
    } else {
      console.log("Removendo apenas uma unidade!");
      arrayCartItems[itemIndex].quantity--;
    }
    numberCartItems--;
  }

  updateCartCount();
  populateCartModal();
  console.log(
    `Carrinho atualizado para ${targetItem.id} (${targetItem.color}). Ação: ${action}`
  );
  console.table(arrayCartItems);
}

function updateCartCount() {
  cartCountSpan.textContent = numberCartItems;
}

function cartProductItem(product, selectedColorVariant, quantity) {
  const displayColor =
    selectedColorVariant && selectedColorVariant !== "N/A"
      ? ` - Cor: ${selectedColorVariant}`
      : "";

  // Garante que o subtotal seja calculado com base nos dados do produto e quantidade
  const subtotal = parseFloat(product.preco) * quantity;
  const productId = product.id; // Garante que o productId é passado corretamente

  return `
    <div class="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
      <div class="me-3">
        <img src="${IMAGE_BASE_PATH}${product.image_url}" alt="${
    product.nome
  }" style="width: 60px; height: 60px; object-fit: contain;">
      </div>
      <div class="flex-grow-1">
        <h6 class="mb-0">${product.nome} ${displayColor}</h6>
        <small class="text-muted">Código: ${product.codigo}</small><br>
        <small class="text-muted">Preço unitário: R$ ${parseFloat(
          product.preco
        ).toFixed(2)}</small>
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-sm btn-outline-secondary update-cart-quantity"
            data-product-id="${productId}"
            data-product-color="${selectedColorVariant}"
            data-action="decrease">-
        </button>
        <span class="mx-2 fw-bold" id="quantity-${productId}-${selectedColorVariant.replace(
    /\s+/g,
    ""
  )}">${quantity}</span>
        <button class="btn btn-sm btn-outline-secondary update-cart-quantity"
            data-product-id="${productId}"
            data-product-color="${selectedColorVariant}"
            data-action="increase">+
        </button>
      </div>
      <div class="ms-3 text-end">
        <span class="fw-bold">R$ ${subtotal.toFixed(2)}</span>
      </div>
    </div>
  `;
}

function createInventoryProductItemHtml(product) {
  let variantesHtml = "";
  const colorVariant = product.variante
    ? product.variante.find((v) => v.tipo === "cor")
    : null;

  if (
    colorVariant &&
    Array.isArray(colorVariant.valores) &&
    colorVariant.valores.length > 0
  ) {
    variantesHtml = `<p class="card-text"><strong>Cores:</strong></p><div class="color-selector">`;
    colorVariant.valores.forEach((color, index) => {
      // Usar replace(/\s+/g, "") para remover espaços para IDs HTML válidos
      const uniqueId = `color-${product.id}-${color.replace(
        /\s+/g,
        ""
      )}-${index}`;
      const isChecked = index === 0 ? "checked" : "";

      // Mapeia a cor para um valor CSS válido, usando o colorMap
      const englishColor = colorMap[color.toLowerCase()] || color;

      variantesHtml += `
        <label for="${uniqueId}" class="color-swatch-label">
          <input type="radio" id="${uniqueId}" name="color-selector-${product.id}" value="${color}" ${isChecked}>
          <span class="color-swatch" style="background-color: ${englishColor};" title="${color}"></span>
        </label>
      `;
    });
    variantesHtml += `</div>`;
  }

  // Retorna a string HTML do cartão do produto
  return `
    <div class="card h-100 shadow-sm">
      <img src="${IMAGE_BASE_PATH}${product.image_url}"
      class="card-img-top p-3" alt="${product.nome}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${product.nome}</h5>
        <p class="card-text"><strong>Preço:</strong> R$ ${parseFloat(
          product.preco
        ).toFixed(2)}</p>
        <p class="card-text"><strong>Código:</strong> ${product.codigo}</p>
        <p class="card-text"><strong>Estoque:</strong> ${
          product.estoque
        } unidades</p>
        ${variantesHtml}
        <button class="btn btn-primary mt-auto add-to-cart" data-product-id="${
          product.id
        }">Adicionar ao carrinho</button>
      </div>
    </div>
  `;
}

function addItemtToCart(item) {
  const itemIndex = arrayCartItems.findIndex(
    (p) => p.id === item.id && p.color === item.color
  );
  if (itemIndex > -1) {
    arrayCartItems[itemIndex].quantity++;
    numberCartItems++;
  } else {
    arrayCartItems.push(item);
    numberCartItems++;
  }

  updateCartCount();

  console.log(
    `Produto ${item.id} (${item.color}) adicionado ao carrinho!`,
    arrayCartItems
  );
  console.table(arrayCartItems);
}

document.addEventListener("DOMContentLoaded", () => {
  // Event listener para quando a modal for exibida (usando eventos do Bootstrap)
  // Isso garante que a modal seja preenchida sempre que for aberta
  const cartModalElement = document.getElementById("cartModal");
  if (cartModalElement) {
    cartModalElement.addEventListener("show.bs.modal", populateCartModal);
  }

  fetch(JSON_API_URL)
    .then((response) => {
      if (!response.ok) {
        // Lança um erro se a resposta não for bem-sucedida (ex: 404, 500)
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((products) => {
      if (!Array.isArray(products)) {
        // Verifica se o JSON é um array, caso contrário, trata como um erro
        console.error("O arquivo JSON não contém um array de produtos.");
        productListDiv.innerHTML =
          '<p class="text-danger">Erro ao carregar os dados. Verifique a estrutura do JSON.</p>';
        return;
      }
      productsData = products;

      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add(
          "col-md-4",
          "col-sm-6",
          "col-12",
          "product-card"
        );

        // Lida com as variantes de cor
        let variantesHtml = "";
        const colorVariant = product.variante
          ? product.variante.find((v) => v.tipo === "cor")
          : null;

        if (
          colorVariant &&
          Array.isArray(colorVariant.valores) &&
          colorVariant.valores.length > 0
        ) {
          variantesHtml = `<p class="card-text"><strong>Cores:</strong></p><div class="color-selector">`;
          colorVariant.valores.forEach((color, index) => {
            const uniqueId = `color-${product.id}-${color.replace(
              /\s+/g,
              ""
            )}-${index}`;
            const isChecked = index === 0 ? "checked" : "";

            const englishColor = colorMap[color.toLowerCase()] || color;

            variantesHtml += `
              <label for="${uniqueId}" class="color-swatch-label">
                <input type="radio" id="${uniqueId}" name="color-selector-${product.id}" value="${color}" ${isChecked}>
                <span class="color-swatch" style="background-color: ${englishColor};" title="${color}"></span>
              </label>
            `;
          });
          variantesHtml += `</div>`;
        }

        productCard.innerHTML = createInventoryProductItemHtml(product);
        productListDiv.appendChild(productCard);
      });

      productListDiv.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
          const productId = event.target.dataset.productId;

          // Variante de cor selecionada
          const selectedColorInput = document.querySelector(
            `input[name="color-selector-${productId}"]:checked`
          );
          const selectedColor = selectedColorInput
            ? selectedColorInput.value
            : "N/A";

          const newCartItem = {
            id: productId,
            color: selectedColor,
            quantity: 1,
          }; // Quantidade para adicionar apenas 1 única unidade do item

          addItemtToCart(newCartItem);
        }
      });

      modalCartItemsDiv.addEventListener("click", (event) => {
        if (event.target.classList.contains("update-cart-quantity")) {
          const productId = event.target.dataset.productId;
          const productColor = event.target.dataset.productColor;
          const action = event.target.dataset.action;

          const itemToModify = { id: productId, color: productColor };

          changeQuantity(itemToModify, action);
        }
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar o JSON:", error);
      productListDiv.innerHTML = `<p class="text-danger">Não foi possível carregar os produtos. Erro: ${error.message}</p>`;
    });
});
