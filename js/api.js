function getHeaders() {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
}

function callApi(method, rota, fn = false) {
    // const url = "http://localhost:3000/" + rota;
    // CAMINHO DA API JAVA
    // const url = "http://localhost:8080/api/v1/" + rota;
    
    const url = "http://127.0.0.1:8080/api/v1/" + rota;

    try {
        fetch(url, {
                method: method, // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: getHeaders(),
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
            })
            .then((response) => response.json())
            .then((data) => {
                let oRetorno = JSON.stringify(data);

                console.log(data);
                // Se existir a funcao, executa a funcao
                // passando por parametro o retorno da API
                if (fn) {
                    // executando a funcao
                    fn(data);
                }
            });
    } catch (error) {
        console.log("Erro:" + error);
    }
}

function callApiPost(method, rota, fn = false, body = false) {
    // const url = "http://localhost:3000/" + rota;
    // const url = "http://localhost:8080/api/v1/" + rota;
    const url = "http://127.0.0.1:8080/api/v1/" + rota;
    try {
        fetch(url, {
                method: method, // *GET, POST, PUT, DELETE, etc.
                mode: "no-cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: getHeaders(),
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                body: JSON.stringify(body),
            })
            .then((response) => response.json())
            .then((data) => {
                let oRetorno = JSON.stringify(data);

                console.log(data);
                // Se existir a funcao, executa a funcao
                // passando por parametro o retorno da API
                if (fn) {
                    // executando a funcao
                    fn(data);
                }
            });
    } catch (error) {
        console.log("Erro:" + error);
    }
}