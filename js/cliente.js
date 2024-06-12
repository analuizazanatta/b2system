var ACAO_INCLUSAO = "ACAO_INCLUSAO";
var ACAO_ALTERACAO = "ACAO_ALTERACAO";

function carregaTabelaConsulta(aListaProdutos) {
    // Se não for array, coloca como array
    if (!Array.isArray(aListaProdutos)) {
        aListaProdutos = new Array(aListaProdutos);
    }

    const tabela = document.querySelector("#tabela-produtos");
    tabela.innerHTML = "";
    aListaProdutos.forEach(function (data, key) {
        const codigo = data.id;
        const nome   = data.nome;
        const cpf    = data.cpf;
        const cidade = data.cidade;
        const estado = data.estado;

        const acoes = getAcoes(codigo);

        tabela.innerHTML +=
            `
        <tr>
            <td>` +
            codigo +
            `</td>
            <td style="text-align: left;">` +
            nome +
            `</td>
            <td style="text-align: right;">` +
            cpf +
            `</td>
            <td>` +
            cidade +
            `</td>
            <td>` +
            estado +
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
                <button class="btn btn-warning" onclick="alterarProduto(` +
        codigo +
        `)">Alterar</button>
                <button  class="btn btn-danger" onclick="excluirProduto(` +
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

    // limpar o codigo do produto
    document.querySelector("#codigo").value = "";
    // seta a ação para INCLUSAO
    document.querySelector("#ACAO").value = ACAO_INCLUSAO;
    
    document.querySelector("#descricao").value = "";
    document.querySelector("#preco").value = "";
    document.querySelector("#estoque").value = "";
}

function confirmarModal() {
    const acao = document.querySelector("#ACAO").value;

    if (acao == ACAO_INCLUSAO) {
        const descricao = document.querySelector("#descricao").value;
        const preco = document.querySelector("#preco").value;
        const estoque = document.querySelector("#estoque").value;

        let body = {        
            descricao: descricao,
            preco: getFloatValue(preco),
            estoque: estoque,
        };

        const method = "POST";
        const rota = "produto";
        callApiPost(
            method,
            rota,
            function (data) {
                console.log("Produto gravado!" + JSON.stringify(data));
                fecharModal();
                executaConsulta();
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
            preco: getFloatValue(preco),
            estoque: estoque,
        };

        const method = "PUT";
        const rota = "produto/" + codigo;
        callApiPost(
            method,
            rota,
            function (data) {
                console.log("Produto alterado!" + JSON.stringify(data));
                fecharModal();
                executaConsulta();
            },
            body
        );
    }
}

function excluirProduto(codigo) {
    const method = "DELETE";
    const rota = "produto/" + codigo;
    callApi(method, rota, function(data){
        executaConsulta("consultaproduto");
    });    
}

function alterarProduto(codigo) {
    const modal = document.querySelector("dialog");
    modal.showModal();
    modal.style.display = "block";

    const method = "GET";
    const rota = "produto/" + codigo;
    callApi(method, rota, function (data) {
        console.log(data);
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
}

function executaConsulta(rota = "consultacliente") {
    const operadorConsulta = document.querySelector("#operadorConsulta").value;
    
    if((operadorConsulta != "igual") && (operadorConsulta != "todos")){
        alert("Operador nao desenvolvido!");
        return false;
    }

    const method = "POST";
    let valor1 = document.querySelector("#campoValor1").value;
    let valor2 = document.querySelector("#campoValor2").value;

    const campoValor = document.querySelector("#filtroConsulta").value;
    const campoConsulta = document.querySelector("#" + campoValor);
    const tipoCampoConsulta = campoConsulta.getAttribute("data-tipo");

    console.log("campo: " + campoValor);
    console.log("operador: " + operadorConsulta);
    console.log("tipoCampoConsulta: " + tipoCampoConsulta);
    console.log("valor1: " + valor1);
    console.log("valor2: " + valor2);

    if (tipoCampoConsulta == "numerico") {
        // valor1 = onlyNumbers(valor1);
        // valor2 = onlyNumbers(valor2);
    }

    let body = {
        campo: campoValor,
        operador: parseOperador(operadorConsulta),
        valor1: valor1,
        valor2: valor2,
    };

    console.log(body);

    callApiPost(
        method,
        rota,
        function (data) {
            if (rota === "consultaproduto") {
                carregaTabelaConsulta(data);
            } else if (rota === "consultacliente") {
                carregaTabelaConsulta(data);
            } else {
                alert("Consulta nao desenvolvida!");
            }
        },
        body
    );
}

function parseOperador(operador) {
    if (operador === "menor_igual") {
        return "<=";
    }
    if (operador === "menor_que") {
        return "<";
    }
    if (operador === "igual") {
        return "=";
    }
    if (operador === "diferente") {
        return "<>";
    }
    if (operador === "maior_que") {
        return ">";
    }
    if (operador === "maior_igual") {
        return ">=";
    }
    if (operador === "preenchido") {
        return "is not null ";
    }
    if (operador === "naopreenchido") {
        return "is null ";
    }
    if (operador === "entre") {
        return "between";
    }
    if (operador === "contem") {
        return "ilike";
    }
    if (operador === "naocontem") {
        return "not ilike";
    }
    if (operador === "contido") {
        return "in";
    }
    if (operador === "naocontido") {
        return "not in";
    }
    if (operador === "inicia_com") {
        return "ilike%";
    }
    if (operador === "termina_com") {
        return "%ilike";
    }

    return "todos";
}