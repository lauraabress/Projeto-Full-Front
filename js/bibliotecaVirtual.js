// Evento para alternar modo escuro ao clicar no botão
document.getElementById("modo-escuro").addEventListener("click", function () {
  // Alterna classes no body
  document.body.classList.toggle("bg-dark");
  document.body.classList.toggle("text-white");

  const navbar = document.querySelector(".navbar");
if (navbar) {
  navbar.classList.toggle("navbar-dark");
  navbar.classList.toggle("bg-dark");

  // Para os links da navbar, também toggle da classe text-white
  document.querySelectorAll(".navbar .nav-link").forEach(link => {
    link.classList.toggle("text-white");
  });
}
  // Alterna modo escuro nos cards
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.classList.toggle("dark-mode");
  });

  // Salva preferência no localStorage (true ou false)
  const modoAtivo = document.body.classList.contains("bg-dark");
  localStorage.setItem("modoEscuro", modoAtivo);
});

// Ao carregar a página, verifica se o modo escuro estava ativo e aplica
window.addEventListener("load", () => {
  const modoAtivo = localStorage.getItem("modoEscuro");

  if (modoAtivo === "true") {
    document.body.classList.add("bg-dark", "text-white");

    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbar.classList.add("navbar-dark", "bg-dark");

      document.querySelectorAll(".navbar .nav-link").forEach(link => {
        link.classList.add("text-white");
      });
    }

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
      card.classList.add("dark-mode");
    });
  }
});


// ------------------------------------------------------------------------

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

// Filtros de categorias
function mostrarTodos() {
  document.querySelectorAll('.card').forEach(card => card.parentElement.style.display = 'block');
}

function mostrarRomance() {
  filtrarPorClasse('romance');
  style: "color: pink; font-weight: bold;";
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

// Pega todos os links do menu
document.querySelectorAll('.navbar .nav-link').forEach(link => {
  link.addEventListener('click', function() {
    // Remove 'active' de todos os filtros
    document.querySelectorAll('.navbar .nav-link').forEach(l => l.classList.remove('active'));

    // Adiciona 'active' no filtro clicado
    this.classList.add('active');
  });
});
