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

// Atualiza a estante na tela
function atualizarEstante() {
  const estante = JSON.parse(localStorage.getItem("estanteLivros")) || [];
  const listaLivros = document.getElementById("lista-livros");
  listaLivros.innerHTML = "";

  if (estante.length === 0) {
    listaLivros.innerHTML = "<p>Nenhum livro na estante.</p>";
    atualizarContagem();
    return;
  }

  estante.forEach((livro, index) => {
    const colDiv = document.createElement("div");
    colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-2";

    const cardDiv = document.createElement("div");
    cardDiv.className = "card bg-white mb-4";
    cardDiv.style.width = "12rem";

    cardDiv.innerHTML = `
      <img src="${livro.imagem}" class="card-img-top" alt="${livro.titulo}">
      <div class="card-body">
        <h5 class="card-title">${livro.titulo}</h5>
        <p class="card-text">${livro.autor}</p>
        <select class="form-select form-select-sm fst-italic mb-2" style="max-width: 150px;">
          <option value="quero ler" ${livro.status === "quero ler" ? "selected" : ""}>Quero Ler</option>
          <option value="lendo" ${livro.status === "lendo" ? "selected" : ""}>Lendo</option>
          <option value="lido" ${livro.status === "lido" ? "selected" : ""}>Lido</option>
        </select>
        <button class="btn btn-warning btn-sm w-100 ler-agora-btn mb-2">Ler agora</button>
        <button class="btn btn-outline-warning btn-sm w-100">Excluir</button>
      </div>
    `;

    // Botão Excluir
    cardDiv.querySelector("button.btn-outline-warning").addEventListener("click", () => {
      if (confirm(`Remover "${livro.titulo}" da estante?`)) {
        estante.splice(index, 1);
        localStorage.setItem("estanteLivros", JSON.stringify(estante));
        atualizarEstante();
        alert(`Livro "${livro.titulo}" removido da estante.`);
      }
    });

    // Botão Ler Agora
    cardDiv.querySelector(".ler-agora-btn").addEventListener("click", () => {
      const tituloUrl = encodeURIComponent(livro.titulo);
      window.location.href = `leitura.html?livro=${tituloUrl}`;
    });

    // Select de status
    cardDiv.querySelector("select").addEventListener("change", (e) => {
      livro.status = e.target.value;
      localStorage.setItem("estanteLivros", JSON.stringify(estante));
      alert(`Status de "${livro.titulo}" atualizado para "${livro.status}".`);
    });

    colDiv.appendChild(cardDiv);
    listaLivros.appendChild(colDiv);
  });

  atualizarContagem();
}

// Atualiza contador de livros na estante
function atualizarContagem() {
  const listaLivros = document.getElementById("lista-livros");
  const contador = document.getElementById("contador-livros");
  const total = listaLivros.children.length;
  contador.textContent = `${total} livro${total !== 1 ? "s" : ""} na estante`;
}

// Adiciona livro na estante
function adicionarEstante(livro) {
  const estante = JSON.parse(localStorage.getItem("estanteLivros")) || [];

  // Verifica se livro já existe
  const existe = estante.some(l => l.titulo === livro.titulo);
  if (existe) {
    alert(`O livro "${livro.titulo}" já está na estante.`);
    return;
  }

  estante.push(livro);
  localStorage.setItem("estanteLivros", JSON.stringify(estante));
  alert(`Livro "${livro.titulo}" adicionado à estante!`);
  atualizarEstante();
}

// Barra de pesquisa
const inputPesquisa = document.getElementById("input-pesquisa");
if (inputPesquisa) {
  inputPesquisa.addEventListener("input", () => {
    const filtro = inputPesquisa.value.toLowerCase();

    document.querySelectorAll("#lista-livros .card").forEach(card => {
      const titulo = card.querySelector(".card-title").textContent.toLowerCase();
      const autor = card.querySelector(".card-text").textContent.toLowerCase();

      card.parentElement.style.display = (titulo.includes(filtro) || autor.includes(filtro)) ? "block" : "none";
    });
  });
}

// Atualiza estante ao carregar a página
window.addEventListener("load", atualizarEstante);