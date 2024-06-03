var ACAO_INCLUSAO = "ACAO_INCLUSAO";
var ACAO_ALTERACAO = "ACAO_ALTERACAO";

function listarProdutosConsulta() {
    // Listando todos os produtos
    const method = "GET";

    const codigo = parseInt(document.querySelector("#codigoConsulta").value);
    let filtroCodigo = "";
    if (codigo > 0) {
        filtroCodigo = "/?id=" + codigo;
    }

    const rota = "produto" + filtroCodigo;
    
    callApi(method, rota, function (data) {
        console.log("Dados da API:");
        console.log(data);

        carregaTabelaConsulta(data);
    });
}

function carregaTabelaConsulta(aListaProdutos) {
    // Se não for array, coloca como array
    if (!Array.isArray(aListaProdutos)) {
        aListaProdutos = new Array(aListaProdutos);
    }

    const tabela = document.querySelector("#tabela-produtos");
    tabela.innerHTML = "";
    aListaProdutos.forEach(function (data, key) {
        const codigo = data.id;
        const descricao = data.descricao;
        const preco = data.preco;
        const estoque = data.estoque;

        const acoes = getAcoes(codigo);

        tabela.innerHTML +=
            `
        <tr>
            <td>` +
            codigo +
            `</td>
            <td>` +
            descricao +
            `</td>
            <td>` +
            preco +
            `</td>
            <td>` +
            estoque +
            `</td>
            <td>` +
            acoes +
            `</td>
        </tr>
        `;
    });
}

// CONSULTA DE PRODUTOS - ALTERAÇÃO/EXCLUSÃO, INSERÇÃO
function getAcoes(codigo) {
    return (
        `<div class="acoes">
                <button onclick="alterarProduto(` +
        codigo +
        `)">Alterar</button>
                <button onclick="excluirProduto(` +
        codigo +
        `)">Excluir</button>                
            </div>
    `
    );
}

function fecharModal() {
    const modal = document.querySelector("dialog");
    modal.close();
    modal.style.display = "none";
}

function incluirProduto() {
    const modal = document.querySelector("dialog");
    modal.showModal();
    modal.style.display = "block";
    proximoId(function (codigo) {
        document.querySelector("#codigo").value = codigo;
    });
}

function proximoId(fn = false) {
    // REGRA DE NEGOCIOS
    // PROXIMO ID = TOTAL DE PRODUTOS + 1

    let totalProdutos = 0;
    // buscar na API TODOS OS PRODUTO E CONTAR

    const method = "GET";
    const rota = "produtos";
    callApi(method, rota, function (data) {
        totalProdutos = data.length;

        totalProdutos = parseInt(totalProdutos + 1);
        if (fn) {
            fn(totalProdutos);
        }
    });
}

function confirmarModal() {
    const acao = document.querySelector("#ACAO").value;

    if (acao == ACAO_INCLUSAO) {
        const codigo = document.querySelector("#codigo").value;
        const descricao = document.querySelector("#descricao").value;
        const preco = document.querySelector("#preco").value;
        const estoque = document.querySelector("#estoque").value;

        let body = {
            id: codigo,
            descricao: descricao + " - " + codigo,
            preco: preco,
            estoque: estoque,
        };

        const method = "POST";
        const rota = "produtos";
        callApiPost(
            method,
            rota,
            function (data) {
                console.log("Produto gravado!" + data);
                // listarProdutosConsulta();
            },
            body
        );
    } else if (acao == ACAO_ALTERACAO) {
        // LOGICA DE ALTERACAO
        console.log("MINHA ACAO:" + acao);

        const codigo = document.querySelector("#codigo").value;
        const descricao = document.querySelector("#descricao").value;
        const preco = document.querySelector("#preco").value;
        const estoque = document.querySelector("#estoque").value;

        let body = {
            descricao: descricao,
            preco: preco,
            estoque: estoque,
        };

        const method = "PUT";
        const rota = "produtos/" + codigo;
        callApiPost(
            method,
            rota,
            function (data) {
                console.log("Produto gravado!" + data);
                listarProdutosConsulta();
            },
            body
        );
    }
}

function excluirProduto(codigo) {
    const method = "DELETE";
    const rota = "produtos/" + codigo;
    callApi(method, rota);
}

function alterarProduto(codigo) {
    const modal = document.querySelector("dialog");
    modal.showModal();

    // DADOS DE ALTERACAO DO PRODUTO
    const method = "GET";
    // http://localhost:3000/produtos/?id=2
    const rota = "produtos/?id=" + codigo;
    callApi(method, rota, function (aListaProdutos) {
        console.log(aListaProdutos);

        aListaProdutos.forEach(function (data, key) {
            const codigo = data.id;

            console.log("codigo da alteracao:" + codigo);

            const descricao = data.descricao;
            const preco = data.preco;
            const estoque = data.estoque;

            document.querySelector("#codigo").value = codigo;
            document.querySelector("#descricao").value = descricao;
            document.querySelector("#preco").value = preco;
            document.querySelector("#estoque").value = estoque;

            // MUDAR A ACAO PARA "ALTERACAO"
            document.querySelector("#ACAO").value = ACAO_ALTERACAO;
        });
    });
}

function executaConsulta() {
    // Listando todos os produtos
    const method = "POST";
    const valor1 = parseInt(document.querySelector("#campoValor1").value);

    console.log("codigo: " + valor1);

    // FIXO, MUDAR CAMPO DINAMICO, DEPOIS
    let body = {
        campo:"codigoConsulta",
        operador: "=",
        valor1:valor1
    }

    const rota = "consultaproduto";
    
    callApiPost(method, rota, function (data) {
        console.log("Dados da API:");
        console.log(data);
        carregaTabelaConsulta(data);
    }, body);
}