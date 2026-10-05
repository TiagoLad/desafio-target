function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function formatarData(data) {
    return data.toLocaleDateString("pt-BR");
}


function calcularDiasAtraso(dataVencimento) {

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);
    dataVencimento.setHours(0, 0, 0, 0);

    const diferenca =
        hoje.getTime() - dataVencimento.getTime();

    const dias =
        Math.floor(diferenca / (1000 * 60 * 60 * 24));

    return dias > 0 ? dias : 0;
}


function calcularJuros(valor, diasAtraso) {
    return valor * 0.025 * diasAtraso;
}


// Formata o campo valor como moeda enquanto o usuário digita
const campoValor = document.getElementById("valor");

campoValor.addEventListener("input", function () {

    let valor = campoValor.value.replace(/\D/g, "");

    if (valor === "") {
        campoValor.value = "";
        return;
    }

    valor = Number(valor) / 100;

    campoValor.value = valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

});


document
    .getElementById("formJuros")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const valorFormatado =
            document.getElementById("valor").value;

        const valor = Number(
            valorFormatado
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        );


        if (valor <= 0 || isNaN(valor)) {
            alert("Informe um valor válido maior que zero.");
            return;
        }


        const vencimentoInput =
            document.getElementById("vencimento").value;

        if (!vencimentoInput) {
            alert("Informe a data de vencimento.");
            return;
        }


        const dataVencimento =
            new Date(vencimentoInput + "T00:00:00");


        const diasAtraso =
            calcularDiasAtraso(dataVencimento);


        const juros =
            calcularJuros(valor, diasAtraso);


        const valorAtualizado =
            valor + juros;


        document.getElementById("valorOriginal")
            .textContent = formatarMoeda(valor);

        document.getElementById("dataVencimento")
            .textContent = formatarData(dataVencimento);

        document.getElementById("diasAtraso")
            .textContent = diasAtraso;

        document.getElementById("valorJuros")
            .textContent = formatarMoeda(juros);

        document.getElementById("valorAtualizado")
            .textContent = formatarMoeda(valorAtualizado);


        document.getElementById("resultadoJuros")
            .style.display = "block";

    });