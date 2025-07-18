# ppua4p1
Projeto Mão na Massa da Disciplina Práticas de Programação e é uma aplicação web simples que simula um inventário de produtos(catálogo) e um carrinho de compras, tem design responsivo e interatividade. Os dados dos produtos são carregados dinamicamente de um mock de API [find_all.json](docs/mocks/find_all.json)

## Tecnologias

* **HTML5:** Estrutura básica da página.
* **CSS3:** Estilização personalizada e ajustes de layout.
* **JavaScript (ES6+):** Lógica dinâmica para carregamento de dados, manipulação do DOM e funcionalidades do carrinho de compras.
* **Bootstrap 5:** Framework CSS para componentes pré-estilizados, sistema de grid, modais e responsividade.
* **Bootstrap Icons:** Para ícones visuais

## Funcionalidades da Aplicação

### Página Principal (Inventário de Produtos)

A página inicial apresenta um catálogo de produtos com as seguintes características:

* **Navbar:** Uma barra de navegação escura na parte superior com o título "Inventário de Produtos".
* **Indicador de Carrinho de Compras:** Na navbar, há um ícone de carrinho com um contador que exibe dinamicamente o número total de itens adicionados ao carrinho.
* **Catálogo de Produtos:** Um contêiner "Nossos Produtos" exibe cada item disponível, mostrando:
    * Nome do produto
    * Preço
    * Código
    * Estoque
    * Imagem do produto
    * Cor
    * **Seletor de Cores:** Produtos possuem variantes de cor, é exibido um seletor visual de cores (bolinhas coloridas). Este seletor utiliza inputs de rádio ocultos para gerenciar a seleção de uma cor específica por produto, com feedback visual para a cor escolhida.
    * **Botão "Adicionar ao carrinho":** Cada produto possui um botão que, ao ser clicado, adiciona o produto (junto com a cor selecionada, se aplicável) ao carrinho de compras e atualiza o contador na navbar.

### Modal do Carrinho de Compras

Ao clicar no indicador do carrinho na navbar, uma modal (pop-up) é exibida, apresentando os detalhes dos itens adicionados:

* **Lista de Itens:** Cada item no carrinho é listado individualmente, exibindo:
    * Imagem do produto
    * Nome do produto e a **cor escolhida** (se aplicável)
    * Código do produto
    * Preço unitário
    * **Controle de Quantidade:** Botões de `+` (aumentar) e `-` (diminuir) permitem que o usuário ajuste a quantidade de cada produto diretamente no carrinho.
    * **Subtotal por Item:** O preço total para a quantidade específica daquele item (preço unitário * quantidade) é exibido.
* **Agrupamento por Modelo e Variante:** Os itens no carrinho são distinguidos por modelo e variante (cor). Isso significa que, se você adicionar "Produto X, cor preta" e depois "Produto X, cor azul", eles serão listados como dois itens separados no carrinho, cada um com sua própria quantidade e subtotal.
* **Total do Carrinho:** No final da modal, é exibido o valor total somando os subtotais de todos os itens no carrinho.
* **Botão "Continuar Comprando":** Fecha a modal, permitindo ao usuário continuar navegando pelo catálogo.

## Estrutura do Projeto
├── docs/   
│   ├── index.html       # Página inicial     
│   ├── script.js        # Lógica da aplicação     
│   └── images/          # Diretório para as imagens dos produtos    
├── styles.css           # Estilos CSS personalizados    
└── README.md            # Este arquivo    
