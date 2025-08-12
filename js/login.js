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

document.getElementById("cadastro").addEventListener("click", function () {
  window.location.href = "cadastro.html";
});
