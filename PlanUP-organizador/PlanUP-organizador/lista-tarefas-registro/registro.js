document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('registroForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const elementoToast = document.getElementById('toastRegistro');
        const toast = new bootstrap.Toast(elementoToast);
        toast.show();

        // delay para ver o toast
        setTimeout(() => {
            event.target.submit();
        }, 1000);
    });

    const mudarTema = document.getElementById('mudarTema');

    if (localStorage.getItem('tema') === 'dark') {
        document.body.classList.add('bg-dark');
        mudarTema.innerHTML = '<i class="bi bi-sun"></i>';
        mudarTema.classList.add('btn-light');
        mudarTema.classList.remove('btn-dark');
    }

    mudarTema.addEventListener('click', function () {
        document.body.classList.toggle('bg-dark');

        if (document.body.classList.contains('bg-dark')) {
            localStorage.setItem('tema', 'dark');
            mudarTema.innerHTML = '<i class="bi bi-sun"></i>';
            mudarTema.classList.add('btn-light');
            mudarTema.classList.remove('btn-dark');
        } else {
            localStorage.setItem('tema', 'light');
            mudarTema.innerHTML = '<i class="bi bi-moon"></i>';
            mudarTema.classList.remove('btn-light');
            mudarTema.classList.add('btn-dark');
        }
    });

});