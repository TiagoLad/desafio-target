let produtos = [];
let movimentacoes = [];


async function carregarEstoque() {

    const estoqueSalvo = localStorage.getItem("estoque");

    if (estoqueSalvo) {

        produtos = JSON.parse(estoqueSalvo);

    } else {

        const resposta = await fetch("estoque.json");
        const dados = await resposta.json();

        produtos = dados.estoque;

        salvarEstoque();

    }

    const historicoSalvo = localStorage.getItem("movimentacoes");

    if (historicoSalvo) {
        movimentacoes = JSON.parse(historicoSalvo);
    }

    carregarProdutos();
    exibirEstoque();
    exibirHistorico();
}


function salvarEstoque() {

    localStorage.setItem(
        "estoque",
        JSON.stringify(produtos)
    );

}


function salvarMovimentacoes() {

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

}


function carregarProdutos() {

    const selectProduto = document.getElementById("produto");

    produtos.forEach((produto) => {

        const option = document.createElement("option");

        option.value = produto.codigoProduto;

        option.textContent =
            `${produto.codigoProduto} - ${produto.descricaoProduto}`;

        selectProduto.appendChild(option);

    });

}


function atualizarEstoqueAtual() {

    const codigoProduto =
        Number(document.getElementById("produto").value);

    const estoqueAtual =
        document.getElementById("estoqueAtual");

    const produto = produtos.find(
        (produto) => produto.codigoProduto === codigoProduto
    );

    if (!produto) {

        estoqueAtual.textContent =
            "Selecione um produto";

        return;

    }

    estoqueAtual.textContent =
        `${produto.estoque} unidades`;

}


function gerarIdMovimentacao() {

    if (movimentacoes.length === 0) {
        return 1;
    }

    const maiorId = Math.max(
        ...movimentacoes.map(movimentacao => movimentacao.id)
    );

    return maiorId + 1;
}


function registrarMovimentacao(event) {

    event.preventDefault();

    const codigoProduto =
        Number(document.getElementById("produto").value);

    const tipo =
        document.getElementById("tipo").value;

    const quantidade =
        Number(document.getElementById("quantidade").value);

    const descricao =
        document.getElementById("descricao").value.trim();


    const produto = produtos.find(
        (produto) => produto.codigoProduto === codigoProduto
    );


    if (!produto) {

        exibirMensagem(
            "Produto não encontrado.",
            "erro"
        );

        return;

    }


    if (quantidade <= 0) {

        exibirMensagem(
            "A quantidade deve ser maior que zero.",
            "erro"
        );

        return;

    }


    if (tipo === "saida" && quantidade > produto.estoque) {

        exibirMensagem(
            "Não há estoque suficiente para realizar esta saída.",
            "erro"
        );

        return;

    }


    if (tipo === "entrada") {

        produto.estoque += quantidade;

    } else if (tipo === "saida") {

        produto.estoque -= quantidade;

    }


    const movimentacao = {

        id: gerarIdMovimentacao(),

        codigoProduto:
            produto.codigoProduto,

        produto:
            produto.descricaoProduto,

        tipo:
            tipo,

        quantidade:
            quantidade,

        descricao:
            descricao,

        estoqueFinal:
            produto.estoque,

        data:
            new Date().toLocaleString("pt-BR")

    };


    movimentacoes.push(movimentacao);

    salvarEstoque();
    salvarMovimentacoes();

    exibirEstoque();
    exibirHistorico();
    atualizarEstoqueAtual();


    exibirMensagem(
        `Movimentação realizada com sucesso. Estoque final: ${produto.estoque} unidades.`,
        "sucesso"
    );


    document
        .getElementById("formMovimentacao")
        .reset();


    document.getElementById("estoqueAtual")
        .textContent = "Selecione um produto";

}


function exibirEstoque() {

    const tabela =
        document.getElementById("tabelaEstoque");

    tabela.innerHTML = "";

    produtos.forEach((produto) => {

        const linha =
            document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.codigoProduto}</td>

            <td>
                ${produto.descricaoProduto}
            </td>

            <td>
                ${produto.estoque}
            </td>
        `;

        tabela.appendChild(linha);

    });

}


function exibirHistorico() {

    const tabela =
        document.getElementById("historicoMovimentacoes");

    tabela.innerHTML = "";

    movimentacoes
        .slice()
        .reverse()
        .forEach((movimentacao) => {

            const linha =
                document.createElement("tr");

                linha.innerHTML = `
                <td>
                  ${movimentacao.id}
                </td>

                <td>
                  ${movimentacao.codigoProduto}
                </td>

                <td>
                  ${movimentacao.produto}
                </td>

                <td>
                ${movimentacao.tipo}
                </td>

                <td>
                ${movimentacao.quantidade}
                </td>

                <td>
                ${movimentacao.descricao}
                </td>

               <td>
               ${movimentacao.estoqueFinal}
               </td>
            `;

            tabela.appendChild(linha);

        });

}


function exibirMensagem(texto, tipo) {

    const mensagem =
        document.getElementById("mensagem");

    mensagem.textContent = texto;

    mensagem.className = tipo;

}


document
    .getElementById("produto")
    .addEventListener(
        "change",
        atualizarEstoqueAtual
    );


document
    .getElementById("formMovimentacao")
    .addEventListener(
        "submit",
        registrarMovimentacao
    );


carregarEstoque();