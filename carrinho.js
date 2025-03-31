// Classe para gerenciar o carrinho de compras
class Carrinho {
    constructor() {
        // Inicializa o carrinho a partir do localStorage ou como um array vazio
        this.itens = JSON.parse(localStorage.getItem('carrinho')) || [];
    }

    // Método para adicionar item ao carrinho
    adicionarItem(produto) {
        // Verifica se o produto já existe no carrinho
        const itemExistente = this.itens.find(item => 
            item.nome === produto.nome && item.preco === produto.preco
        );
        
        if (itemExistente) {
            // Se existir, aumenta a quantidade
            itemExistente.quantidade++;
        } else {
            // Se não existir, adiciona novo item com quantidade 1
            this.itens.push({
                id: `produto-${Date.now()}`,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: 1
            });
        }
        
        // Salva no localStorage
        this.salvarCarrinho();
        // Atualiza a visualização do carrinho
        this.atualizarCarrinho();
    }

    // Método para remover item do carrinho
    removerItem(id) {
        this.itens = this.itens.filter(item => item.id !== id);
        this.salvarCarrinho();
        this.atualizarCarrinho();
    }

    // Método para atualizar a quantidade de um item
    atualizarQuantidade(id, quantidade) {
        const item = this.itens.find(item => item.id === id);
        if (item) {
            item.quantidade = quantidade;
            this.salvarCarrinho();
            this.atualizarCarrinho();
        }
    }

    // Método para salvar o carrinho no localStorage
    salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.itens));
    }

    // Método para atualizar a visualização do carrinho
    atualizarCarrinho() {
        // Atualiza o número de itens no ícone do carrinho
        const iconCarrinho = document.querySelector('.icon span');
        if (iconCarrinho) {
            iconCarrinho.textContent = this.itens.reduce((total, item) => total + item.quantidade, 0);
        }

        // Se estiver na página do carrinho, atualiza a lista de itens
        if (window.location.pathname.includes('carrinho.html')) {
            this.renderizarCarrinho();
        }
    }

    // Método para renderizar os itens do carrinho na página
    renderizarCarrinho() {
        const containerCarrinho = document.querySelector('.cart-items');
        const resumoCarrinho = document.querySelector('.cart-summary');
        if (!containerCarrinho) {
            console.error('Elemento .cart-items não encontrado');
            return;
        }

        // Limpa o conteúdo anterior
        if (containerCarrinho) containerCarrinho.innerHTML = '';

        if (this.itens.length === 0) {
            // Mostra mensagem de carrinho vazio
            const emptyCartDiv = document.createElement('div');
            emptyCartDiv.classList.add('empty-cart');
            emptyCartDiv.innerHTML = `
                <p>Seu carrinho está vazio.</p>
                <a href="main.html" class="continue-shopping">Ir para a Loja</a>
            `;
            document.querySelector('.container').appendChild(emptyCartDiv);
            
            // Esconde o resumo do carrinho
            if (resumoCarrinho) resumoCarrinho.style.display = 'none';
            return;
        }

        // Renderiza os itens do carrinho
        let subtotal = 0;
        this.itens.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            
            // Remover o símbolo 'R$' e substituir ',' por '.' para converter corretamente
            const precoNumerico = parseFloat(item.preco.replace('R$', '').replace(',', '.'));
            const quantidadeTotal = precoNumerico * item.quantidade;
            subtotal += quantidadeTotal;

            itemDiv.innerHTML = `
                <div class="item-image">
                    <img src="${item.imagem}" alt="${item.nome}">
                </div>
                <div class="item-details">
                    <div class="item-name">${item.nome}</div>
                    <div class="item-price">${item.preco}</div>
                    <div class="item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn diminuir-quantidade" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantidade}</span>
                            <button class="quantity-btn aumentar-quantidade" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">Remover</button>
                    </div>
                </div>
            `;

            containerCarrinho.appendChild(itemDiv);
        });

        // Adiciona eventos de quantidade e remoção
        this.adicionarEventosCarrinho();

        // Atualiza o resumo do carrinho
        if (resumoCarrinho) {
            const frete = 25.00;
            const desconto = 50.00;
            const total = subtotal + frete - desconto;

            resumoCarrinho.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            resumoCarrinho.querySelector('.summary-row:nth-child(4) span:last-child').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    }

    // Método para adicionar eventos de interação no carrinho
    adicionarEventosCarrinho() {
        // Botões de remover item
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.removerItem(id);
            });
        });

        // Botões de diminuir quantidade
        document.querySelectorAll('.diminuir-quantidade').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const itemAtual = this.itens.find(item => item.id === id);
                if (itemAtual && itemAtual.quantidade > 1) {
                    this.atualizarQuantidade(id, itemAtual.quantidade - 1);
                }
            });
        });

        // Botões de aumentar quantidade
        document.querySelectorAll('.aumentar-quantidade').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const itemAtual = this.itens.find(item => item.id === id);
                if (itemAtual) {
                    this.atualizarQuantidade(id, itemAtual.quantidade + 1);
                }
            });
        });
    }
}

// Inicializa o carrinho quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const carrinho = new Carrinho();

    // Adiciona eventos de compra nos produtos da página principal
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const produtoCard = e.target.closest('.product-wrapper');
            const produto = {
                nome: produtoCard.querySelector('.product-name').textContent,
                preco: produtoCard.querySelector('.discount-price')?.textContent || 
                       produtoCard.querySelector('.product-price span:last-child')?.textContent || 
                       'R$ 0,00',
                imagem: produtoCard.querySelector('.product-image')?.src || 
                        'caminho/para/imagem/padrao.jpg'
            };

            carrinho.adicionarItem(produto);
        });
    });

    // Inicializa a visualização do carrinho na página de carrinho
    if (window.location.pathname.includes('carrinho.html')) {
        carrinho.renderizarCarrinho();
    }
});