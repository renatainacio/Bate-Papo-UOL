axios.defaults.headers.common['Authorization'] = 'BtXNJoiFoeQE4oiiOTK7wiYj';

const nome = prompt("Informe o seu nome");
const nomeEnviar = { name:nome };
const promisePostNome = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', nomeEnviar);
promisePostNome.then(resposta => console.log(resposta));
promisePostNome.catch(erro => console.log(erro));
idInterval = setInterval(manterConexao, 5000);
buscarMensagens();

setTimeout(encerrar, 100000);

function manterConexao() {
    const promiseManterConexao = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', nomeEnviar); 
}

function encerrar() {
    clearInterval(idInterval);
}

function buscarMensagens() {
    const promiseGetMensagens = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promiseGetMensagens.then(renderizarMensagens);
    promiseGetMensagens.catch(erroMensagens);
}

function renderizarMensagens(resposta)
{
    resposta.data.forEach(mensagem => 
        {
            if (mensagem.type === "message")
                document.querySelector(".chat").innerHTML +=
                `<div class="msg">
                    <p><span class="horario">(${mensagem.time})</span>
                    <strong>${mensagem.from}</strong> para <strong> ${mensagem.to}: </strong> ${mensagem.text}</p>
                </div>`
            else if (mensagem.type === "status")
                document.querySelector(".chat").innerHTML +=
                `<div class="notificacao">
                    <p><span class="horario">(${mensagem.time})</span>
                    <strong>${mensagem.from} </strong>${mensagem.text}</p>
                </div>` 
            console.log(mensagem)
        });
}

function erroMensagens(erro)
{
    console.log("Algo deu errado");
    console.log(erro);
}