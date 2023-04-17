axios.defaults.headers.common['Authorization'] = 'BtXNJoiFoeQE4oiiOTK7wiYj';

let nome;
let nomeObj;

function enviarNomeAoServidor()
{
    nome = document.querySelector(".input-nome").value;
    nomeObj = { name : nome };
    console.log(nomeObj);
    const promisePostNome = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', nomeObj);
    promisePostNome.then(entrarNaSala);
    promisePostNome.catch(erroNome);
}

function entrarNaSala()
{
    document.querySelector(".tela-login").classList.add("escondido");
    document.querySelector(".header").classList.remove("escondido");
    document.querySelector(".chat").classList.remove("escondido");
    document.querySelector(".footer").classList.remove("escondido");
    buscarMensagens();
    listaDeParticipantes();
    idIntervalConexao = setInterval(manterConexao, 5000);
    idIntervalMensagens = setInterval(buscarMensagens, 3000);
    idIntervalParticipantes = setInterval(listaDeParticipantes, 10000);
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
        (mensagem.type === "message" || mensagem.to === nomeObj.name || mensagem.from === nomeObj.name));
    document.querySelector(".chat").innerHTML = "";
    mensagensExibir.forEach(mensagem => 
        {
            if (mensagem.type === "message")
                document.querySelector(".chat").innerHTML +=
                `<div class="msg" data-test="message">
                    <p><span class="horario">(${mensagem.time})</span><strong>${mensagem.from}</strong> para <strong> ${mensagem.to}: </strong> ${mensagem.text}</p>
                </div>`
            else if (mensagem.type === "private_message")
                document.querySelector(".chat").innerHTML +=
                `<div class="reservada" data-test="message">
                    <p><span class="horario">(${mensagem.time})</span><strong>${mensagem.from}</strong> reservadamente para <strong> ${mensagem.to}: </strong> ${mensagem.text}</p>
                </div>`
            else if (mensagem.type === "status")
                document.querySelector(".chat").innerHTML +=
                `<div class="notificacao" data-test="message">
                    <p><span class="horario">(${mensagem.time})</span><strong>${mensagem.from} </strong>${mensagem.text}</p>
                </div>` 
        });
}

function erroNome() {
    alert("O nome informado já está em uso. Tente novamente.")
    reload();
}

function manterConexao() {
    const promiseManterConexao = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', nomeObj); 
}

function enviarMensagem()
{
    const mensagem = document.querySelector(".inputUsuario").value;
    const nomeSelecionado = document.querySelector(".lista-participantes").querySelector(".selecionado").querySelector(".nome").innerHTML;
    const visibilidade = document.querySelector(".visibilidade").querySelector(".selecionado").querySelector("p").innerHTML;
    let tipo;
    if (visibilidade === "Público")
        tipo = "message";
    else
        tipo = "private_message";
    document.querySelector(".inputUsuario").value = "";
    console.log(mensagem);
    const mensagemObjeto = 
    {
        from: nomeObj.name,
        to: nomeSelecionado,
        text: mensagem,
        type: tipo
    }
    console.log(mensagemObjeto);
    const promiseEnviarMensagem = axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', mensagemObjeto);
    promiseEnviarMensagem.then(buscarMensagens);
    promiseEnviarMensagem.catch(erro=>console.log(erro));
}

function erroMensagens(erro)
{
    console.log("Algo deu errado");
    console.log(erro);
    window.location.reload();
}

function handleKeydown(event) {
    if (event.keyCode == 13)
        enviarMensagem();
}

function reload(erro) {
    window.location.reload();
}

function listaDeParticipantes() {
    const promiseListaParticipantes = axios.get("https://mock-api.driven.com.br/api/vm/uol/participants");
    promiseListaParticipantes.then(atualizarParticipantes);
    promiseListaParticipantes.catch(reload);
}

function mostrarListaParticipantes() {
    document.querySelector(".menu-lateral").classList.add("aparecer-menu");
    document.querySelector(".barra-lateral").classList.add("aparecer-barra-lateral");
}

function esconderMenuLateral() {
    document.querySelector(".menu-lateral").classList.remove("aparecer-menu");
    document.querySelector(".barra-lateral").classList.remove("aparecer-barra-lateral");    
}

function escolherContato(item) {
    document.querySelector(".lista-contatos").querySelector(".selecionado").classList.remove("selecionado");
    item.classList.add("selecionado");
    const nomeSelecionado = document.querySelector(".lista-participantes").querySelector(".selecionado").querySelector(".nome").innerHTML;
    if(nomeSelecionado != "Todos")
        document.querySelector(".contato-visibilidade").innerHTML = `Enviando para ${nomeSelecionado}`;
    else
        document.querySelector(".contato-visibilidade").innerHTML = "";
    }

function escolherVisibilidade(item) {
    document.querySelector(".visibilidade").querySelector(".selecionado").classList.remove("selecionado");
    item.classList.add("selecionado");
    const visibilidade = document.querySelector(".visibilidade").querySelector(".selecionado").querySelector("p").innerHTML;
    if (visibilidade != "Público")
        document.querySelector(".contato-visibilidade").innerHTML += ` (reservadamente)`;
}

function atualizarParticipantes(resposta) {
    const selecionadoAnteriormente = document.querySelector(".lista-participantes").querySelector(".selecionado").querySelector(".nome").innerHTML;
    const participantes = resposta.data;
    console.log(participantes);
    document.querySelector(".lista-participantes").innerHTML =
    `<li>
        <div class="item-lista-participantes selecionado" onclick="escolherContato(this)" data-test="all">
            <div class="item-participantes">
                <ion-icon name="people" class="people"></ion-icon>    
                <p class="nome">Todos</p>
            </div>
            <ion-icon name="checkmark" data-test="check"></ion-icon>
        </div>
    </li>`
    participantes.forEach(participante => {
        if(participante.name === selecionadoAnteriormente)
        {
            document.querySelector(".lista-participantes").innerHTML +=
                `<li>
                    <div class="item-lista-participantes selecionado" onclick="escolherContato(this)" data-test="participant">
                        <div class="item-participantes">
                            <ion-icon name="people" class="people"></ion-icon>    
                            <p class="nome">${participante.name}</p>
                        </div>
                        <ion-icon name="checkmark" data-test="check"></ion-icon>
                    </div>
                </li>`        
        }
        else
        {
            document.querySelector(".lista-participantes").innerHTML +=
                `<li>
                    <div class="item-lista-participantes" onclick="escolherContato(this)" data-test="participant">
                        <div class="item-participantes">
                            <ion-icon name="people" class="people"></ion-icon>    
                            <p class="nome">${participante.name}</p>
                        </div>
                        <ion-icon name="checkmark" data-test="check"></ion-icon>
                    </div>
                </li>`        
        }
    });
}