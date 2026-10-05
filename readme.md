# Desafio Técnico

Este projeto foi desenvolvido utilizando **HTML, CSS e JavaScript puro**.

A escolha dessas tecnologias teve como objetivo manter a solução simples, organizada e compatível com o escopo proposto no desafio técnico, sem a necessidade de frameworks ou bibliotecas externas.

## Por que HTML, CSS e JavaScript?

O **HTML** foi utilizado para estruturar as páginas e os elementos da aplicação, como formulários, tabelas, campos de entrada e navegação entre os exercícios.

O **CSS** foi utilizado para padronizar o visual de todas as páginas, garantindo uma interface mais organizada, responsiva e agradável para utilização.

O **JavaScript** foi utilizado para implementar toda a lógica necessária para resolução dos desafios, incluindo:

- leitura dos arquivos JSON;
- cálculo das comissões dos vendedores;
- controle de entrada e saída de estoque;
- atualização do saldo dos produtos;
- registro das movimentações;
- cálculo de juros com base na data de vencimento;
- validação dos dados informados pelo usuário;
- atualização dinâmica dos resultados na interface.

## Motivo da escolha

A utilização de JavaScript no navegador permite demonstrar tanto conhecimentos de lógica de programação quanto manipulação de dados e interação com a interface.

Além disso, para os requisitos apresentados, não havia necessidade de utilizar frameworks como React, Vue ou Angular, nem de criar uma aplicação backend.

Dessa forma, a solução permanece mais simples e fácil de executar, ao mesmo tempo em que demonstra conceitos importantes de desenvolvimento web.

## Persistência dos dados de estoque

Como a aplicação foi desenvolvida apenas no front-end, o navegador não pode alterar diretamente o arquivo `estoque.json`.

Por esse motivo, o arquivo JSON é utilizado como fonte inicial dos produtos e os dados atualizados do estoque e das movimentações são armazenados no `localStorage` do navegador.

Essa abordagem permite manter as alterações realizadas durante a utilização da aplicação sem a necessidade de um banco de dados ou servidor backend.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- JSON
- LocalStorage