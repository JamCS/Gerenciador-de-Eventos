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
    formEvento.addEventListener('submit', (event) => {
        event.preventDefault();
        
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
        
        const eventosSalvos = JSON.parse(localStorage.getItem('eventosplus-eventos') || '[]')
        
        eventosSalvos.push(novoEvento);
        
        localStorage.setItem('eventosplus-eventos', JSON.stringify(eventosSalvos));
        
        formEvento.reset();
        
    })
}

//------------------------------------------------------------------------------------------------------

const listaEventos = document.querySelector('#lista-eventos');

if (listaEventos) {
    const eventosSalvos = JSON.parse(localStorage.getItem('eventosplus-eventos') || '[]');
    const contador = document.querySelector('#contador-eventos');

    if (contador) {
        contador.textContent = eventosSalvos.length
        ? `${eventosSalvos.length} evento(s) cadastrado(s)` : 'Nenhum evento cadastrado ainda';
    }
    if (!eventosSalvos.length) {
        listaEventos.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info mb-0">
                    Nenhum evento cadastrado ainda. Vá em <strong>Registrar Eventos</strong> para criar o primeiro
                </div>
            </div>
        `;
        return;
    }

    function formatarData(valor) {
        if (!valor) return '';
        const [ano, mes , dia] = valor.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    eventosSalvos.forEach((evento, index) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';

        const col = document.createElement('div');
        card.className = 'card-100';

        const col = document.createElement('div');
        cardBody.className = 'card-body';

        const titulo = document.createElement('h5');
        titulo.className = 'card-title';
        titulo.textContent = evento.titulo;
        
        const data = document.createElement('p'); 
        data.className = 'card-text mb1';
        data.innerHTML = `<strong>Data:</strong> ${formatarData(evento.data)}`;
        
        const local = document.createElement('p'); 
        local.className = 'card-text mb1';
        local.innerHTML = `<strong>Local:</strong> ${evento.local}`;

        const descricao = document.createElement('p');
        descricao.className = 'card-text text-muted';
        descricao.textContent = evento.descricao || 'Sem descrição';

        cardBody.appendChild(titulo);
        cardBody.appendChild(data);
        cardBody.appendChild(local);
        cardBody.appendChild(descricao);

        cardBody.appendChild(cardBody);
        col.appendChild(card);
        listaEventos.appendChild(col);

    });
}