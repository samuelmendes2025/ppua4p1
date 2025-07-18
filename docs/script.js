document.addEventListener('DOMContentLoaded', () => {
    const JSON_API_URL = 'https://samuelmendes2025.github.io/ppua4p1/mocks/find_all.json';
    const IMAGE_BASE_PATH = 'images/';

    const colorMap = {
        "preto": "black",
        "prata": "silver",
        "azul": "blue",
        "branco": "white",
        "vermelho": "red",
        "laranja": "orange",
        "dourado": "gold",
        "cinza": "gray"
    };

    const productListDiv = document.getElementById('product-list');
    const cartCountSpan = document.getElementById('cart-count');

    const modalCartItemsDiv = document.getElementById('modal-cart-items');
    const modalCartTotalSpan = document.getElementById('modal-cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    let cartItems = [];
    let productsData = [];

    function updateCartCount() {
        cartCountSpan.textContent = cartItems.length;
    }


    function populateCartModal() {
        modalCartItemsDiv.innerHTML = ''; // Limpa o conteúdo anterior da modal
        let totalCartValue = 0;

        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block'; // Mostra a mensagem de carrinho vazio
            modalCartItemsDiv.appendChild(emptyCartMessage);
            modalCartTotalSpan.textContent = 'R$ 0,00';
            return;
        } else {
            emptyCartMessage.style.display = 'none'; // Esconde a mensagem
        }

        // Contar a quantidade de cada produto no carrinho
        const productQuantities = {};
        cartItems.forEach(product => {
            const key = `${product.id}`;
            productQuantities[key] = (productQuantities[key] || 0) || { quantity: 0, color: product.color };
            productQuantities[key].quantity++;
        });

        // Iterar sobre os produtos no carrinho e exibi-los
        for (const key in productQuantities) {
            const { quantity, color: selectedColorVariant } = productQuantities[key];
            // Encontrar o produto correspondente nos dados carregados
            const product = productsData.find(p => p.id === key);

            const displayColor = selectedColorVariant && selectedColorVariant !== 'N/A'
                ? ` - Cor: ${selectedColorVariant}`
                : '';

            if (product) {
                const subtotal = parseFloat(product.preco) * quantity;
                totalCartValue += subtotal;

                const itemHtml = `
                    <div>
                        <span>${product.nome} ${displayColor}</span>
                        <span>Código: ${product.codigo}</span>
                        <span>Preço unitário: ${product.preco}</span>
                        <span>Quantidade: ${quantity}</span>
                        <strong>Subtotal R$ ${subtotal.toFixed(2)}</strong>
                    </div>
                `;
                modalCartItemsDiv.innerHTML += itemHtml;
            }
        }

        // Atualizar o total do carrinho na modal
        modalCartTotalSpan.textContent = `R$ ${totalCartValue.toFixed(2)}`;
    }

    // Event listener para quando a modal for exibida (usando eventos do Bootstrap)
    // Isso garante que a modal seja preenchida sempre que for aberta
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
        cartModalElement.addEventListener('show.bs.modal', populateCartModal);
    }

    fetch(JSON_API_URL)
        .then(response => {
            if (!response.ok) {
                // Lança um erro se a resposta não for bem-sucedida (ex: 404, 500)
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            if (!Array.isArray(products)) {
                // Verifica se o JSON é um array, caso contrário, trata como um erro
                console.error("O arquivo JSON não contém um array de produtos.");
                productListDiv.innerHTML = '<p class="text-danger">Erro ao carregar os dados. Verifique a estrutura do JSON.</p>';
                return;
            }
            productsData = products;

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('col-md-4', 'col-sm-6', 'col-12', 'product-card');

                // Lida com as variantes de cor
                let variantesHtml = '';
                const colorVariant = product.variante ? product.variante.find(v => v.tipo === 'cor') : null;

                if (colorVariant && Array.isArray(colorVariant.valores) && colorVariant.valores.length > 0) {
                    variantesHtml = `<p class="card-text"><strong>Cores:</strong></p><div class="color-selector">`;
                    colorVariant.valores.forEach((color, index) => {
                        const uniqueId = `color-${product.id}-${color.replace(/\s+/g, '')}-${index}`;
                        const isChecked = index === 0 ? 'checked' : '';

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

                productCard.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${IMAGE_BASE_PATH}${product.image_url}" class="card-img-top p-3" alt="${product.nome}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.nome}</h5>
                            <p class="card-text"><strong>Preço:</strong> R$ ${parseFloat(product.preco).toFixed(2)}</p>
                            <p class="card-text"><strong>Código:</strong> ${product.codigo}</p>
                            <p class="card-text"><strong>Estoque:</strong> ${product.estoque} unidades</p>
                            ${variantesHtml}
                            <button class="btn btn-primary mt-auto add-to-cart" data-product-id="${product.id}">Adicionar ao carrinho</button>
                        </div>
                    </div>
                `;
                productListDiv.appendChild(productCard);
            });

            productListDiv.addEventListener('click', (event) => {
                if (event.target.classList.contains('add-to-cart')) {
                    const productId = event.target.dataset.productId;

                    // Variante de cor selecionada
                    const selectedColorInput = document.querySelector(`input[name="color-selector-${productId}"]:checked`);
                    const selectedColor = selectedColorInput ? selectedColorInput.value : 'N/A';

                    let newCardItem = {
                        "id": productId,
                        "color": selectedColor
                    };

                    cartItems.push(newCardItem);
                    updateCartCount();
                    console.log(`Produto ${productId} (${selectedColor}) adicionado ao carrinho!`, cartItems);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao buscar o JSON:', error);
            productListDiv.innerHTML = `<p class="text-danger">Não foi possível carregar os produtos. Erro: ${error.message}</p>`;
        });
});