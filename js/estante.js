// VAI PARA A PÁGINA DA ESTANTE
document.getElementById("estante").addEventListener("click", function() {
  window.location.href = "estante.html";
});

// VAI PARA A PÁGINA DO PERFIL
document.getElementById("perfil").addEventListener("click", function() {
  window.location.href = "perfil.html";
});

// VAI PARA A PÁGINA INICIAL AO CLICAR NA LOGO
document.getElementById("logo").addEventListener("click", function() {
  window.location.href = "bibliotecaVirtual.html";
});

// ------------------------------------------------------------------------

// Função para atualizar a estante na tela
function atualizarEstante() {
  const estante = JSON.parse(localStorage.getItem('estanteLivros')) || [];
  const listaLivros = document.getElementById('lista-livros');
  listaLivros.innerHTML = '';

  if (estante.length === 0) {
    listaLivros.innerHTML = '<p>Nenhum livro na estante.</p>';
    atualizarContagem();
    return;
  }

  estante.forEach((livro, index) => {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-12 col-sm-6 col-md-4 col-lg-2';

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card bg-white mb-4';
    cardDiv.style.width = '12rem';

    cardDiv.innerHTML = `
      <img src="${livro.imagem}" class="card-img-top" alt="${livro.titulo}">
      <div class="card-body">
        <h5 class="card-title">${livro.titulo}</h5>
        <p class="card-text">${livro.autor}</p>
        <select class="form-select form-select-sm fst-italic mb-2" style="max-width: 150px;">
          <option value="quero ler" ${livro.status === 'quero ler' ? 'selected' : ''}>Quero Ler</option>
          <option value="lendo" ${livro.status === 'lendo' ? 'selected' : ''}>Lendo</option>
          <option value="lido" ${livro.status === 'lido' ? 'selected' : ''}>Lido</option>
        </select>
        <button class="btn btn-outline-warning btn-sm w-100">Excluir</button>
      </div>
    `;

    // Ação do botão Excluir
    cardDiv.querySelector('button').addEventListener('click', () => {
      if (confirm(`Remover "${livro.titulo}" da estante?`)) {
        estante.splice(index, 1);
        localStorage.setItem('estanteLivros', JSON.stringify(estante));
        atualizarEstante();
        alert(`Livro "${livro.titulo}" removido da estante.`);
      }
    });

    // Ação da mudança de status
    cardDiv.querySelector('select').addEventListener('change', (e) => {
      livro.status = e.target.value;
      localStorage.setItem('estanteLivros', JSON.stringify(estante));
      alert(`Status de "${livro.titulo}" atualizado para "${livro.status}".`);
    });

    colDiv.appendChild(cardDiv);
    listaLivros.appendChild(colDiv);
  });

  atualizarContagem();
}

// Atualiza o contador de livros
function atualizarContagem() {
  const listaLivros = document.getElementById('lista-livros');
  const contador = document.getElementById('contador-livros');
  const total = listaLivros.children.length;
  contador.textContent = `${total} livro${total !== 1 ? 's' : ''} na estante`;
}

// Atualiza a estante na tela quando a página carrega
window.addEventListener('load', atualizarEstante);

// Barra de pesquisa
const inputPesquisa = document.getElementById('input-pesquisa');
inputPesquisa.addEventListener('input', () => {
  const filtro = inputPesquisa.value.toLowerCase();

  document.querySelectorAll('.card').forEach(card => {
    const titulo = card.querySelector('.card-title').textContent.toLowerCase();
    const autor = card.querySelector('.card-text').textContent.toLowerCase();

    card.parentElement.style.display = (titulo.includes(filtro) || autor.includes(filtro)) ? 'block' : 'none';
  });
});
