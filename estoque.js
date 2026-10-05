let produtos = [];
let movimentacoes = [];


async function carregarEstoque() {

    try {

        const estoqueSalvo =
            localStorage.getItem("estoque");


        if (estoqueSalvo) {

            produtos =
                JSON.parse(estoqueSalvo);

        } else {

            const resposta =
                await fetch("estoque.json");


            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível carregar o arquivo estoque.json."
                );

            }


            const dados =
                await resposta.json();


            if (
                !dados.estoque ||
                !Array.isArray(dados.estoque)
            ) {

                throw new Error(
                    "Estrutura do arquivo estoque.json inválida."
                );

            }


            produtos =
                dados.estoque;


            salvarEstoque();

        }


        const historicoSalvo =
            localStorage.getItem("movimentacoes");


        if (historicoSalvo) {

            movimentacoes =
                JSON.parse(historicoSalvo);

        }


        carregarProdutos();

        exibirEstoque();

        exibirHistorico();


    } catch (erro) {

        console.error(erro);


        exibirMensagem(
            "Erro ao carregar os dados de estoque.",
            "erro"
        );

    }

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

    const selectProduto =
        document.getElementById("produto");


    selectProduto.innerHTML =
        '<option value="">Selecione um produto</option>';


    produtos.forEach((produto) => {

        const option =
            document.createElement("option");


        option.value =
            produto.codigoProduto;


        option.textContent =
            `${produto.codigoProduto} - ${produto.descricaoProduto}`;


        selectProduto.appendChild(option);

    });

}


function atualizarEstoqueAtual() {

    const codigoProduto =
        Number(
            document
                .getElementById("produto")
                .value
        );


    const estoqueAtual =
        document.getElementById("estoqueAtual");


    const produto =
        produtos.find(
            (produto) =>
                produto.codigoProduto === codigoProduto
        );


    if (!produto) {

        estoqueAtual.textContent =
            "Selecione um produto";


        estoqueAtual.className =
            "estoque-atual";


        return;

    }


    if (produto.estoque === 0) {

        estoqueAtual.textContent =
            "Produto sem estoque";


        estoqueAtual.className =
            "estoque-atual estoque-zero";


        return;

    }


    estoqueAtual.textContent =
        `${produto.estoque} unidades`;


    estoqueAtual.className =
        "estoque-atual";

}


function gerarIdMovimentacao() {

    if (movimentacoes.length === 0) {

        return 1;

    }


    const idsNumericos =
        movimentacoes
            .map(
                (movimentacao) =>
                    Number(movimentacao.id)
            )
            .filter(
                (id) =>
                    !isNaN(id)
            );


    if (idsNumericos.length === 0) {

        return 1;

    }


    const maiorId =
        Math.max(...idsNumericos);


    return maiorId + 1;

}


function registrarMovimentacao(event) {

    event.preventDefault();


    const codigoProduto =
        Number(
            document
                .getElementById("produto")
                .value
        );


    const tipo =
        document
            .getElementById("tipo")
            .value;


    const quantidade =
        Number(
            document
                .getElementById("quantidade")
                .value
        );


    const descricao =
        document
            .getElementById("descricao")
            .value
            .trim();


    // =========================
    // VALIDAÇÃO DO PRODUTO
    // =========================

    if (!codigoProduto) {

        exibirMensagem(
            "Selecione um produto.",
            "erro"
        );

        return;

    }


    const produto =
        produtos.find(
            (produto) =>
                produto.codigoProduto === codigoProduto
        );


    if (!produto) {

        exibirMensagem(
            "Produto não encontrado.",
            "erro"
        );

        return;

    }


    // =========================
    // VALIDAÇÃO DO TIPO
    // =========================

    if (
        tipo !== "entrada" &&
        tipo !== "saida"
    ) {

        exibirMensagem(
            "Selecione o tipo da movimentação.",
            "erro"
        );

        return;

    }


    // =========================
    // VALIDAÇÃO DA QUANTIDADE
    // =========================

    if (
        isNaN(quantidade) ||
        quantidade <= 0
    ) {

        exibirMensagem(
            "Informe uma quantidade maior que zero.",
            "erro"
        );

        return;

    }


    if (!Number.isInteger(quantidade)) {

        exibirMensagem(
            "A quantidade deve ser um número inteiro.",
            "erro"
        );

        return;

    }


    // =========================
    // VALIDAÇÃO DA DESCRIÇÃO
    // =========================

    if (descricao === "") {

        exibirMensagem(
            "Informe uma descrição para a movimentação.",
            "erro"
        );

        return;

    }


    // =========================
    // VALIDAÇÕES DE SAÍDA
    // =========================

    if (tipo === "saida") {

        if (produto.estoque === 0) {

            exibirMensagem(
                `O produto "${produto.descricaoProduto}" está sem estoque.`,
                "erro"
            );

            return;

        }


        if (quantidade > produto.estoque) {

            exibirMensagem(
                `Estoque insuficiente. Estoque disponível: ${produto.estoque} unidades.`,
                "erro"
            );

            return;

        }

    }


    // =========================
    // REALIZA MOVIMENTAÇÃO
    // =========================

    if (tipo === "entrada") {

        produto.estoque += quantidade;

    } else {

        produto.estoque -= quantidade;

    }


    const movimentacao = {

        id:
            gerarIdMovimentacao(),

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
            new Date()
                .toLocaleString("pt-BR")

    };


    movimentacoes.push(
        movimentacao
    );


    salvarEstoque();

    salvarMovimentacoes();


    exibirEstoque();

    exibirHistorico();


    // =========================
    // MENSAGEM DE RETORNO
    // =========================

    if (
        tipo === "saida" &&
        produto.estoque === 0
    ) {

        exibirMensagem(
            `Movimentação realizada com sucesso. O produto "${produto.descricaoProduto}" agora está sem estoque.`,
            "sucesso"
        );

    } else {

        exibirMensagem(
            `Movimentação realizada com sucesso. Estoque final: ${produto.estoque} unidades.`,
            "sucesso"
        );

    }


    // Limpa todos os campos após o registro
    limparFormulario();

}


function limparFormulario() {

    const formulario =
        document.getElementById(
            "formMovimentacao"
        );


    formulario.reset();


    document
        .getElementById("produto")
        .value = "";


    document
        .getElementById("tipo")
        .value = "";


    document
        .getElementById("quantidade")
        .value = "";


    document
        .getElementById("descricao")
        .value = "";


    const estoqueAtual =
        document.getElementById(
            "estoqueAtual"
        );


    estoqueAtual.textContent =
        "Selecione um produto";


    estoqueAtual.className =
        "estoque-atual";

}


function exibirEstoque() {

    const tabela =
        document.getElementById(
            "tabelaEstoque"
        );


    tabela.innerHTML = "";


    produtos.forEach((produto) => {

        const linha =
            document.createElement("tr");


        const situacaoEstoque =
            produto.estoque === 0
                ? `<span class="sem-estoque">Sem estoque</span>`
                : `${produto.estoque} unidades`;


        linha.innerHTML = `
            <td>
                ${produto.codigoProduto}
            </td>

            <td>
                ${produto.descricaoProduto}
            </td>

            <td>
                ${situacaoEstoque}
            </td>
        `;


        tabela.appendChild(linha);

    });

}


function exibirHistorico() {

    const tabela =
        document.getElementById(
            "historicoMovimentacoes"
        );


    tabela.innerHTML = "";


    if (movimentacoes.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="7">
                    Nenhuma movimentação registrada.
                </td>
            </tr>
        `;

        return;

    }


    movimentacoes
        .slice()
        .reverse()
        .forEach((movimentacao) => {

            const linha =
                document.createElement("tr");


            const tipoFormatado =
                movimentacao.tipo === "entrada"
                    ? "Entrada"
                    : "Saída";


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
                    ${tipoFormatado}
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
        document.getElementById(
            "mensagem"
        );


    mensagem.textContent =
        texto;


    mensagem.className =
        tipo;

}


document
    .getElementById("produto")
    .addEventListener(
        "change",
        atualizarEstoqueAtual
    );


document
    .getElementById(
        "formMovimentacao"
    )
    .addEventListener(
        "submit",
        registrarMovimentacao
    );


carregarEstoque();