function calcularComissao(valor) {

    if (valor < 100) {
        return 0;
    }

    if (valor < 500) {
        return valor * 0.01;
    }

    return valor * 0.05;
}


function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


async function carregarVendas() {

    try {

        const resposta = await fetch("vendedor.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o arquivo JSON.");
        }

        const dados = await resposta.json();

        const vendedores = {};

        dados.vendas.forEach((venda) => {

            const nome = venda.vendedor;
            const valor = venda.valor;

            if (!vendedores[nome]) {

                vendedores[nome] = {
                    quantidadeVendas: 0,
                    totalVendido: 0,
                    comissao: 0
                };

            }

            vendedores[nome].quantidadeVendas++;

            vendedores[nome].totalVendido += valor;

            vendedores[nome].comissao += calcularComissao(valor);

        });

        exibirResultados(vendedores);

    } catch (erro) {

        console.error("Erro:", erro);

    }

}


function exibirResultados(vendedores) {

    const corpoTabela = document.getElementById("resultado");

    corpoTabela.innerHTML = "";

    Object.entries(vendedores).forEach(([nome, dados]) => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${nome}</td>

            <td>
                ${dados.quantidadeVendas}
            </td>

            <td>
                ${formatarMoeda(dados.totalVendido)}
            </td>

            <td class="comissao">
                ${formatarMoeda(dados.comissao)}
            </td>
        `;

        corpoTabela.appendChild(linha);

    });

}


carregarVendas();