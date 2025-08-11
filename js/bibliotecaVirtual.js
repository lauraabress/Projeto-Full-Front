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
// Função para adicionar livro na estante (localStorage)
function adicionarEstante(botao, event) {
  event.preventDefault();

  const card = botao.closest('.card');
  const titulo = card.querySelector('.card-title').textContent;
  const autor = card.querySelector('.card-text').textContent;
  const imagem = card.querySelector('img').src;

  // Pega a lista atual da estante do localStorage ou cria uma nova
  let estante = JSON.parse(localStorage.getItem('estanteLivros')) || [];

  // Verifica se o livro já está na estante
  const existe = estante.some(livro => livro.titulo === titulo && livro.autor === autor);
  if (existe) {
    alert(`O livro "${titulo}" já está na estante!`);
    return;
  }

  // Adiciona o livro e salva no localStorage
  estante.push({ titulo, autor, imagem, status: 'quero ler' });
  localStorage.setItem('estanteLivros', JSON.stringify(estante));

  alert(`Livro "${titulo}" adicionado à estante!`);
}

// Navegação entre páginas (estante, perfil, inicial)
document.getElementById("estante").addEventListener("click", () => {
  window.location.href = "estante.html";
});

document.getElementById("perfil").addEventListener("click", () => {
  window.location.href = "perfil.html";
});

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "bibliotecaVirtual.html";
});

// Filtros de categorias
function mostrarTodos() {
  document.querySelectorAll('.card').forEach(card => card.parentElement.style.display = 'block');
}

function mostrarRomance() {
  filtrarPorClasse('romance');
}

function mostrarAventura() {
  filtrarPorClasse('aventura');
}

function mostrarDrama() {
  filtrarPorClasse('drama');
}

function mostrarTerror() {
  filtrarPorClasse('terror');
}

function mostrarSuspense() {
  filtrarPorClasse('suspense');
}

function mostrarFantasia() {
  filtrarPorClasse('fantasia');
}

function mostrarFiccao() {
  filtrarPorClasse('ficcao');
}

function mostrarSobrenatural() {
  filtrarPorClasse('sobrenatural');
}

function filtrarPorClasse(classe) {
  document.querySelectorAll('.card').forEach(card => {
    card.parentElement.style.display = card.classList.contains(classe) ? 'block' : 'none';
  });
}

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