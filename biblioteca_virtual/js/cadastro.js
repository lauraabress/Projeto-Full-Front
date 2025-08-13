document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    if (this.checkValidity()) {
      // Pega os valores do formulário
      const usuario = document.getElementById("in-usuario").value;
      const email = document.getElementById("in-email").value;
      const cpf = document.getElementById("in-cpf").value;
      const senha = document.getElementById("in-senha").value;

      // Salva no localStorage
      localStorage.setItem(
        "usuarioCadastrado",
        JSON.stringify({ usuario, email, cpf, senha })
      );

      // Redireciona
      window.location.href = "bibliotecaVirtual.html";
    }
  });

document.getElementById("login").addEventListener("click", function () {
  window.location.href = "login.html";
});
