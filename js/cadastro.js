// VAI PARA A TELA INICIAL
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // impede o envio automático

    if (this.checkValidity()) {
      // se todos os campos obrigatórios estão preenchidos
      window.location.href = "bibliotecaVirtual.html";
    }
  });

document.getElementById("login").addEventListener("click", function () {
  window.location.href = "login.html";
});
