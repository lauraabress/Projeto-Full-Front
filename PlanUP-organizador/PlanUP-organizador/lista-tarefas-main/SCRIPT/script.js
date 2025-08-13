document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const taskData = document.getElementById('taskData');
    const adicionarTarefa = document.getElementById('adicionarTarefa');
    const taskList = document.getElementById('taskList');
    const btnTodos = document.getElementById('filtroTodos');
    const btnPendentes = document.getElementById('filtroPendentes');
    const btnConcluidas = document.getElementById('filtroConcluidas');
    const mudarTema = document.getElementById('mudarTema');
    const ordenarSelect = document.getElementById('ordenarSelect');
    const taskConcluidas = document.getElementById('contadorConcluidas');
    const taskTotal = document.getElementById('contadorTotal');
    const taskPendentes = document.getElementById('contadorPendentes');

    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    
    let filtroAtual = "todos";

    function salvar() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    // função para atualizar contadores
    function atualizarContadores() {
        taskTotal.textContent = tarefas.length;
        taskConcluidas.textContent = tarefas.filter(tarefa => tarefa.concluida).length;
        taskPendentes.textContent = tarefas.filter(tarefa => !tarefa.concluida).length;
    }

    function criarItemTarefa(texto, data, concluida, index) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center m-3 py-4';
        li.id = concluida ? 'concluida' : 'pendente';

        if (concluida) {
            li.classList.add('list-group-item-success');
        }

        const span = document.createElement('span');
        span.textContent = texto;
        if (concluida) {
            span.classList.add('text-decoration-line-through');
        }

        if (data) {
            const small = document.createElement('small');
            small.className = 'text-muted fs-5 ms-2';
            small.textContent = `(${data.split('-').reverse().join('/')})`;
            span.appendChild(small);
        }

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group btn-group-sm';

        // marcar como concluida
        const inputConcluir = document.createElement('button');
        inputConcluir.className = 'btn btn-success';
        inputConcluir.innerHTML = '<i class="bi bi-check-lg"></i>';
        inputConcluir.title = 'Concluir';
        inputConcluir.onclick = function () {
            tarefas[index].concluida = !tarefas[index].concluida;
            salvar();
            mostrarTarefas(filtroAtual);
        };

        // remover tarefa
        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-danger';
        btnRemover.innerHTML = '<i class="bi bi-trash"></i>';
        btnRemover.title = 'Remover';
        btnRemover.onclick = function () {
            tarefas.splice(index, 1);
            salvar();
            mostrarTarefas(filtroAtual);
        };

        btnGroup.appendChild(inputConcluir);
        btnGroup.appendChild(btnRemover);

        li.appendChild(span);
        li.appendChild(btnGroup);

        return li;
    }

    //mostrar tarefas pelos filtros
    function mostrarTarefas(filtro = "todos") {
        filtroAtual = filtro;
        taskList.innerHTML = "";

        let tarefasFiltradas = tarefas;
        if (filtro === "pendentes") {
            tarefasFiltradas = tarefas.filter(tarefa => !tarefa.concluida);
        } else if (filtro === "concluidas") {
            tarefasFiltradas = tarefas.filter(tarefa => tarefa.concluida);
        }

        tarefasFiltradas.forEach((tarefa, index) => {
            const indexReal = tarefas.indexOf(tarefa);
            const li = criarItemTarefa(tarefa.texto, tarefa.data, tarefa.concluida, indexReal);
            taskList.appendChild(li);
        });

        atualizarContadores();
    }

    adicionarTarefa.addEventListener('click', function () {
        const texto = taskInput.value.trim();
        const data = taskData.value;
        if (texto) {
            tarefas.push({ texto: texto, data: data, concluida: false });
            salvar();
            mostrarTarefas(filtroAtual);
            taskInput.value = '';
            taskData.value = '';
            taskInput.focus();
        }
    });

    btnTodos.addEventListener("click", () => mostrarTarefas("todos"));
    btnPendentes.addEventListener("click", () => mostrarTarefas("pendentes"));
    btnConcluidas.addEventListener("click", () => mostrarTarefas("concluidas"));

    //ordena tarefas pelo select
    ordenarSelect.addEventListener('change', function () {
        const ordem = ordenarSelect.value;
        tarefas.sort(function (a, b) {
            if (!a.data) return 1;
            if (!b.data) return -1;
            
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            return ordem === "dataCrescente" ? dataA - dataB : dataB - dataA;
        });
        salvar();
        mostrarTarefas(filtroAtual);
    });
    
    // mudança de tema
    if (localStorage.getItem('tema') === 'dark') {
        document.body.classList.add('bg-dark');
        mudarTema.innerHTML = '<i class="bi bi-sun"></i>';
        mudarTema.classList.add('btn-light');
        mudarTema.classList.remove('btn-dark');
    }

    mudarTema.addEventListener('click', function () {
        document.body.classList.toggle('bg-dark');
        
        if (document.body.classList.contains('bg-dark')) {
            localStorage.setItem('tema', 'dark');
            mudarTema.innerHTML = '<i class="bi bi-sun"></i>';
            mudarTema.classList.add('btn-light');
            mudarTema.classList.remove('btn-dark');
        } else {
            localStorage.setItem('tema', 'light');
            mudarTema.innerHTML = '<i class="bi bi-moon"></i>';
            mudarTema.classList.remove('btn-light');
            mudarTema.classList.add('btn-dark');
        }
    });

    mostrarTarefas();
});