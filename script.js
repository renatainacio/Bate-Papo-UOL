axios.defaults.headers.common['Authorization'] = 'BtXNJoiFoeQE4oiiOTK7wiYj';

let nome = prompt("Informe o seu nome");
let nomeObj;

enviarNomeAoServidor(nome);

function enviarNomeAoServidor()
{
    nomeObj = { name : nome };
    const promisePostNome = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', nomeObj);
    promisePostNome.then(entrarNaSala);
    promisePostNome.catch(nomeInvalido);    
}

function entrarNaSala()
{
    buscarMensagens();
    idIntervalConexao = setInterval(manterConexao, 5000);
    idIntervalMensagens = setInterval(buscarMensagens, 3000);
    document.querySelector(".inputUsuario").addEventListener("keydown", handleKeydown);
    // document.querySelector(".inputUsuario").onkeydown = function(e){
    //     if(e.KeyboardEvent.keyCode == 13){
    //       enviarMensagem();
    //     }
    //  };
}

function nomeInvalido(erro)
{
    if (erro.response.status === 400)
    {
        nome = prompt("O nome informado já está em uso, tente outro nome");
        enviarNomeAoServidor(nome);
    }
}

function buscarMensagens() {
    const promiseGetMensagens = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promiseGetMensagens.then(renderizarMensagens);
    promiseGetMensagens.catch(erroMensagens);
}

function renderizarMensagens(resposta)
{
    const mensagensExibir = resposta.data.filter(mensagem =>
        (mensagem.to === "Todos" || mensagem.to === nomeObj.nome || mensagem.from === nomeObj.nome));
    document.querySelector(".chat").innerHTML = "";
    mensagensExibir.forEach(mensagem => 
        {
            if (mensagem.type === "message" && mensagem.to === "Todos")
                document.querySelector(".chat").innerHTML +=
                `<div class="msg" data-test="message">
                    <p><span class="horario">(${mensagem.time})</span>
                    <strong>${mensagem.from}</strong> para <strong> ${mensagem.to}: </strong> ${mensagem.text}</p>
                </div>`
            else if (mensagem.type === "message")
                document.querySelector(".chat").innerHTML +=
                `<div class="reservada" data-test="message">
                    <p><span class="horario">(${mensagem.time})</span>
                    <strong>${mensagem.from}</strong> reservadamente para <strong> ${mensagem.to}: </strong> ${mensagem.text}</p>
                </div>`
            else if (mensagem.type === "status")
                document.querySelector(".chat").innerHTML +=
                `<div class="notificacao" data-test="message">
                    <p><span class="horario">(${mensagem.time})</span>
                    <strong>${mensagem.from} </strong>${mensagem.text}</p>
                </div>` 
        });
}

function manterConexao() {
    const promiseManterConexao = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', nomeObj); 
}

function enviarMensagem()
{
    const mensagem = document.querySelector(".inputUsuario").value;
    document.querySelector(".inputUsuario").value = "";
    console.log(mensagem);
    const mensagemObjeto = 
    {
        from: nomeObj.name,
        to:"Todos",
        text: mensagem,
        type: "message"
    }
    const promiseEnviarMensagem = axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', mensagemObjeto);
    promiseEnviarMensagem.then(buscarMensagens);
    promiseEnviarMensagem.catch(erro=>
        {
            console.log(erro);
            window.location.reload();
        });
}

function erroMensagens(erro)
{
    console.log("Algo deu errado");
    console.log(erro);
}

function handleKeydown(event) {
    if (event.keyCode == 13)
        enviarMensagem();
}
