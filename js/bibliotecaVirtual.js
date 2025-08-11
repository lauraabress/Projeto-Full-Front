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

// FILTRO DE CATEGORIAS
function mostrarTodos(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        col.style.display = 'block';
    });
}

function mostrarRomance(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        if(card.classList.contains('romance')){
            col.style.display = 'block';
        } else {
            col.style.display = 'none';
        }
    });
}

function mostrarAventura(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        if(card.classList.contains('aventura')){
            col.style.display = 'block';
        } else {
            col.style.display = 'none';
        }
    });
}

function mostrarDrama(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        if(card.classList.contains('drama')){
            col.style.display = 'block';
        } else {
            col.style.display = 'none';
        }
    });
}  

function mostrarTerror(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        if(card.classList.contains('terror')){
            col.style.display = 'block';
        } else {
            col.style.display = 'none';
        }
    });
}

function mostrarSuspense(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        if(card.classList.contains('suspense')){
            col.style.display = 'block';
        } else {
            col.style.display = 'none';
        }
    });
}

function mostrarFantasia(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        if(card.classList.contains('fantasia')){
            col.style.display = 'block';
        } else {
            col.style.display = 'none';
        }
    });
}

function mostrarFiccao(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        if(card.classList.contains('ficcao')){
            col.style.display = 'block';
        } else {
            col.style.display = 'none';
        }
    });
}

function mostrarSobrenatural(){
    document.querySelectorAll('.card').forEach(function(card) {
        const col = card.parentElement;
        if(card.classList.contains('sobrenatural')){  // Corrigi aqui o 'obrenatural' para 'sobrenatural'
            col.style.display = 'block';
        } else {
            col.style.display = 'none';
        }
    });
}

// ------------------------------------------------------------------------

// BARRA DE PESQUISA

const inputPesquisa = document.getElementById('input-pesquisa');

inputPesquisa.addEventListener('input', function() {
  const filtro = inputPesquisa.value.toLowerCase();

  document.querySelectorAll('.card').forEach(card => {
    const titulo = card.querySelector('.card-title').textContent.toLowerCase();
    const autor = card.querySelector('.card-text').textContent.toLowerCase();

    const col = card.parentElement;

    if (titulo.includes(filtro) || autor.includes(filtro)) {
      col.style.display = 'block';
    } else {
      col.style.display = 'none';
    }
  });
});