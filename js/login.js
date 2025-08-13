// FAZER LOGIN
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  if (this.checkValidity()) {
    const email = document.getElementById("in-email").value;
    const senha = document.getElementById("in-senha").value;

    // Recuperar dados salvos
    const usuarioCadastrado = JSON.parse(localStorage.getItem("usuarioCadastrado"));

    if (usuarioCadastrado && email === usuarioCadastrado.email && senha === usuarioCadastrado.senha) {
      alert("Login realizado com sucesso!");
      window.location.href = "bibliotecaVirtual.html";
    } else {
      alert("E-mail ou senha incorretos!");
    }
  }
});

// Ir para cadastro
document.getElementById("cadastro").addEventListener("click", function () {
  window.location.href = "cadastro.html";
});

// Recupera os dados do localStorage
const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));