axios.defaults.headers.common['Authorization'] = 'BtXNJoiFoeQE4oiiOTK7wiYj';

let nome = prompt("Informe o seu nome");

let nomeEnviar;
enviarNomeAoServidor(nome);

function manterConexao() {
    const promiseManterConexao = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', nomeEnviar); 
}

function encerrar() {
    clearInterval(idIntervalConexao);
}

function buscarMensagens() {
    const promiseGetMensagens = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promiseGetMensagens.then(renderizarMensagens);
    promiseGetMensagens.catch(erroMensagens);
}

function enviarNomeAoServidor(nome)
{
    nomeEnviar = { name:nome };
    const promisePostNome = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', nomeEnviar);
    promisePostNome.then(entrarNaSala);
    promisePostNome.catch(erro => 
        {
            if(erro.response.status === 400)
            nome = prompt("O nome informado já está em uso, tente outro nome");
            enviarNomeAoServidor(nome);
        });    
}

function renderizarMensagens(resposta)
{
    document.querySelector(".chat").innerHTML = "";
    resposta.data.forEach(mensagem => 
        {
            if (mensagem.type === "message")
                document.querySelector(".chat").innerHTML +=
                `<div class="msg" data-test="message">
                    <p><span class="horario">(${mensagem.time})</span>
                    <strong>${mensagem.from}</strong> para <strong> ${mensagem.to}: </strong> ${mensagem.text}</p>
                </div>`
            else if (mensagem.type === "status")
                document.querySelector(".chat").innerHTML +=
                `<div class="notificacao" data-test="message">
                    <p><span class="horario">(${mensagem.time})</span>
                    <strong>${mensagem.from} </strong>${mensagem.text}</p>
                </div>` 
        });
}

function enviarMensagem()
{
    const mensagem = document.querySelector(".inputUsuario").value;
    document.querySelector(".inputUsuario").value = "";
    console.log(mensagem);
    const mensagemObjeto = 
    {
        from: nomeEnviar.name,
        to:"Todos",
        text: mensagem,
        type: "message"
    }
    const promiseEnviarMensagem = axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', mensagemObjeto);
    promiseEnviarMensagem.then(buscarMensagens);
    promiseEnviarMensagem.catch(erro=>console.log(erro));
}

document.querySelector(".inputUsuario").onkeydown = function(e){
    if(e.KeyboardEvent.keyCode == 13){
      enviarMensagem();
    }
 };

function erroMensagens(erro)
{
    console.log("Algo deu errado");
    console.log(erro);
}

function handleKeydown(event) {
    if (event.keyCode == 13)
        enviarMensagem();
}

function entrarNaSala()
{
    buscarMensagens();
    idIntervalConexao = setInterval(manterConexao, 5000);
    idIntervalMensagens = setInterval(buscarMensagens, 3000);
    document.querySelector(".inputUsuario").addEventListener("keydown", handleKeydown);
}