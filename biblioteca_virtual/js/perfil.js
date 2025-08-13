// Evento para alternar modo escuro ao clicar no botão
document.getElementById("modo-escuro").addEventListener("click", function () {
  // Alterna classes no body
  document.body.classList.toggle("bg-dark");
  document.body.classList.toggle("text-white");

  // Salva preferência no localStorage (true ou false)
  const modoAtivo = document.body.classList.contains("bg-dark");
  localStorage.setItem("modoEscuro", modoAtivo);
});

// Ao carregar a página, verifica se o modo escuro estava ativo e aplica
window.addEventListener("load", () => {
  const modoAtivo = localStorage.getItem("modoEscuro");
    if (modoAtivo === "true") {
    document.body.classList.add("bg-dark", "text-white");
  }
});

// ------------------------------------------------------------------------

// VAI PARA A PÁGINA DA ESTANTE
document.getElementById("estante").addEventListener("click", function () {
  window.location.href = "estante.html";
});

// VAI PARA A PÁGINA DO PERFIL
document.getElementById("perfil").addEventListener("click", function () {
  window.location.href = "perfil.html";
});

// VAI PARA A PÁGINA INICIAL AO CLICAR NA LOGO
document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "bibliotecaVirtual.html";
});

// ------------------------------------------------------------------------

// Recupera os dados do localStorage
const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

if (!usuario) {
  window.location.href = "login.html";
} else {
  document.getElementById("perfil-usuario").textContent = usuario.usuario;
  document.getElementById("perfil-email").textContent = usuario.email;
  document.getElementById("perfil-cpf").textContent = usuario.cpf;
  document.getElementById("perfil-senha").textContent = "*".repeat(usuario.senha.length);
}

document.getElementById("voltar").addEventListener("click", function () {
  window.location.href = "bibliotecaVirtual.html"; // volta para a página da biblioteca virtual
});

document.getElementById("sair").addEventListener("click", function () {
  window.location.href = "login.html"; // vai para a página de login
});
