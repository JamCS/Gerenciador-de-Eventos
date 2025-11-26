const body = document.body;
const btnToggleTheme = document.querySelector('#btn-toggle-theme');

if (!body || !btnToggleTheme) {
    console.warn('Elemento de tema não encontrado.');
}else{
    function aplicarTema(theme) {
        body.setAttribute('data-bs-theme', theme);
        localStorage.setItem('eventosplus-theme', theme);
    
        if (theme === 'dark') {
            btnToggleTheme.textContent = '☀️';
        } else {
            btnToggleTheme.textContent = '🌙';
        }
    }

    const temaSalvo = localStorage.getItem('eventosplus-theme');
    const temaInicial = temaSalvo === 'light' ? 'light' : 'dark';

    aplicarTema(temaInicial);

    btnToggleTheme.addEventListener('click', () => {
        const temaAtual = body.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark';
        const proximoTema = temaAtual === 'dark' ? 'light' : 'dark';
        aplicarTema(proximoTema);
    });
}

