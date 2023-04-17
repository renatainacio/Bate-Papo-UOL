axios.defaults.headers.common['Authorization'] = 'BtXNJoiFoeQE4oiiOTK7wiYj';

let nome = prompt("Informe o seu nome");

let nomeEnviar;
enviarNomeAoServidor(nome);

function enviarNomeAoServidor(nome)
{
    nomeEnviar = { name:nome };
    const promisePostNome = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', nomeEnviar);
    promisePostNome.then(entrarNaSala);
    promisePostNome.catch(erro => 
        {
            if (erro.response.status === 400)
            {
                nome = prompt("O nome informado já está em uso, tente outro nome");
                enviarNomeAoServidor(nome);
            }
        });    
}

function entrarNaSala()
{
    buscarMensagens();
    idIntervalConexao = setInterval(manterConexao, 5000);
    idIntervalMensagens = setInterval(buscarMensagens, 3000);
    document.querySelector(".inputUsuario").addEventListener("keydown", handleKeydown);
}

function buscarMensagens() {
    const promiseGetMensagens = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promiseGetMensagens.then(renderizarMensagens);
    promiseGetMensagens.catch(erroMensagens);
}

function renderizarMensagens(resposta)
{
    const mensagensExibir = resposta.data.filter(mensagem =>
        (mensagem.to === "Todos" || mensagem.to === nomeEnviar.nome || mensagem.from === nomeEnviar.nome));
    document.querySelector(".chat").innerHTML = "";
    mensagensExibir.forEach(mensagem => 
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

function manterConexao() {
    const promiseManterConexao = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', nomeEnviar); 
}

function encerrar() {
    clearInterval(idIntervalConexao);
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
    promiseEnviarMensagem.catch(erro=>
        {
            console.log(erro);
            window.location.reload();
        });
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
