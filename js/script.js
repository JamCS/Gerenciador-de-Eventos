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

//------------------------------------------------------------------------------------------------------

const formEvento = document.querySelector('#form-evento');

if (formEvento) {
    formEvento.addEventListener('submit', (Event) => {
        Event.preventDefault();
        
        const titulo = document.querySelector('#titulo').value.trim();
        const data = document.querySelector('#data').value;
        const local = document.querySelector('#local').value.trim();
        const descricao = document.querySelector('#descricao').value.trim();

        if (!titulo || !data || !local) {
            alert('Preencha pelo menos Título, Data e Local do evento.')
            return;
        }

        const novoEvento = {
            titulo,
            data,
            local,
            descricao,
            criadoEm: new Date().toISOString()
        };

        const evetosSalvos = JSON.parse(localStorage.getItem('eventosplus-eventos'))

        eventosSalvos.push(novoEvento);

        localStorage.setItem('eventosplus-eventos', JSON.stringify(eventosSalvos));

        formEvento.reset();

    })
}
