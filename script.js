class Tarefa {
    #concluida;

    constructor(descricao, concluida = false) {
        descricao = descricao.trim();

        if (descricao === "") {
            throw new Error("Digite uma tarefa.");
        }

        this.descricao = descricao;
        this.#concluida = concluida;
    }

    get concluida() {
        return this.#concluida;
    }

    alternarConclusao() {
        this.#concluida = !this.#concluida;
    }
}

const listaDeTarefas = [];

const campoTarefas = document.getElementById("campo-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");
const botaoAdicionar = document.querySelector(".botao-principal");
const botaoTema = document.getElementById("botao-alternar-tema");

function salvarTarefas() {
    const tarefasParaSalvar = listaDeTarefas.map(function (tarefa) {
        return {
            descricao: tarefa.descricao,
            concluida: tarefa.concluida
        };
    });
    localStorage.setItem("tarefas", JSON.stringify(tarefasParaSalvar));
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas) {
        const tarefas = JSON.parse(tarefasSalvas);
        tarefas.forEach(function (tarefaSalva) {
            const tarefa = new Tarefa(
                tarefaSalva.descricao,
                tarefaSalva.concluida
            );
            listaDeTarefas.push(tarefa);
        });
    }
    renderizarTarefas();
}

botaoAdicionar.addEventListener("click", function () {
    try {
        const descricao = campoTarefas.value;
        const novaTarefa = new Tarefa(descricao);

        listaDeTarefas.push(novaTarefa);
        salvarTarefas();
        renderizarTarefas();

        campoTarefas.value = "";
        campoTarefas.focus();
    } catch (erro) {
        alert(erro.message);
    }
});

campoTarefas.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        botaoAdicionar.click();
    }
});

function renderizarTarefas() {
    listaTarefas.innerHTML = "";

    listaDeTarefas.forEach(function (tarefa, index) {
        const item = document.createElement("li");
        item.classList.add("item-tarefa");

        if (tarefa.concluida) {
            item.classList.add("concluido");
        }

        // Cria o texto
        const texto = document.createElement("span");
        texto.textContent = tarefa.descricao;

        // Cria Área de Ações
        const acoes = document.createElement("div");
        acoes.classList.add("acoes-tarefa");

        // Botão Concluir (Com ícones em SVG nativos para nunca sumirem)
        const botaoConcluir = document.createElement("button");
        botaoConcluir.classList.add("botao-acao", "concluir");
        if (tarefa.concluida) {
            botaoConcluir.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>`;
        } else {
            botaoConcluir.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>`;
        }

        botaoConcluir.addEventListener("click", function () {
            tarefa.alternarConclusao();
            salvarTarefas();
            renderizarTarefas();
        });

        // Botão Excluir (Com ícone de lixeira clássica em SVG nativo)
        const botaoExcluir = document.createElement("button");
        botaoExcluir.classList.add("botao-acao", "excluir");
        botaoExcluir.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>`;

        botaoExcluir.addEventListener("click", function () {
            listaDeTarefas.splice(index, 1);
            salvarTarefas();
            renderizarTarefas();
        });

        // Montagem final do item
        acoes.appendChild(botaoConcluir);
        acoes.appendChild(botaoExcluir);
        
        item.appendChild(texto);
        item.appendChild(acoes);
        listaTarefas.appendChild(item);
    });

    atualizarContador();
}

function atualizarContador() {
    const quantidade = listaDeTarefas.length;
    if (quantidade === 0) {
        contadorTarefas.textContent = "0 registros no tomo";
    } else if (quantidade === 1) {
        contadorTarefas.textContent = "1 feito anotado";
    } else {
        contadorTarefas.textContent = `${quantidade} feitos guardados`;
    }
}

// Alternar o tema mantendo compatibilidade nativa
botaoTema.addEventListener("click", function () {
    document.body.classList.toggle("modo-escuro");
    const icone = botaoTema.querySelector("i");

    if (icone) {
        if (document.body.classList.contains("modo-escuro")) {
            icone.className = "fa-solid fa-wand-magic-sparkles"; 
        } else {
            icone.className = "fa-solid fa-feather"; 
        }
    }
});

carregarTarefas();