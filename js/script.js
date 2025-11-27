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

function mostrarMensagem(mensagem, tipo = 'success') {
  const alerta = document.querySelector('#mensagem-resultado');
  if (!alerta) return;

  alerta.textContent = mensagem;
  alerta.className = `alert alert-${tipo} mt-2`;
  alerta.classList.remove('d-none');

  setTimeout(() => {
    alerta.classList.add('d-none');
  }, 3000);
}

//------------------------------------------------------------------------------------------------------

const formEvento = document.querySelector('#form-evento');
let indiceEdicao = null;

if (formEvento) {
  indiceEdicao = localStorage.getItem('eventosplus-evento-editando');

  if (indiceEdicao !== null) {
    const eventosSalvos = JSON.parse(localStorage.getItem('eventosplus-eventos') || '[]');
    const evento = eventosSalvos[Number(indiceEdicao)];

    if (evento) {
      document.querySelector('#titulo').value = evento.titulo || '';
      document.querySelector('#data').value = evento.data || '';
      document.querySelector('#local').value = evento.local || '';
      document.querySelector('#descricao').value = evento.descricao || '';
      document.querySelector('#organizadores').value = evento.organizadores || '';

      const tituloPagina = document.querySelector('h2.text-center');
      if (tituloPagina) tituloPagina.textContent = 'Editar Evento';

      const botaoSubmit = formEvento.querySelector('button[type="submit"]');
      if (botaoSubmit) botaoSubmit.textContent = 'Salvar alterações';
    } else {
      indiceEdicao = null;
      localStorage.removeItem('eventosplus-evento-editando');
    }
  }

  formEvento.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const titulo = document.querySelector('#titulo').value.trim();
    const data = document.querySelector('#data').value;
    const local = document.querySelector('#local').value.trim();
    const descricao = document.querySelector('#descricao').value.trim();
    const organizadores = document.querySelector('#organizadores').value;
    
    if (!titulo || !data || !local) {
      alert('Preencha pelo menos Título, Data e Local do evento.');
      return;
    }

    try {
      const eventosSalvos = JSON.parse(localStorage.getItem('eventosplus-eventos') || '[]');

      if (indiceEdicao !== null) {
        const idx = Number(indiceEdicao);

        if (eventosSalvos[idx]) {
          eventosSalvos[idx] = {
            ...eventosSalvos[idx],
            titulo,
            data,
            local,
            descricao,
            organizadores,
            atualizadoEm: new Date().toISOString()
          };
        }

        localStorage.setItem('eventosplus-eventos', JSON.stringify(eventosSalvos));
        mostrarMensagem('Evento editado com sucesso!', 'success');
      } else {
        const novoEvento = {
          titulo,
          data,
          local,
          descricao,
          organizadores,
          criadoEm: new Date().toISOString()
        };

        eventosSalvos.push(novoEvento);
        localStorage.setItem('eventosplus-eventos', JSON.stringify(eventosSalvos));
        mostrarMensagem('Evento salvo com sucesso!', 'success');
      }

      localStorage.removeItem('eventosplus-evento-editando');
      indiceEdicao = null;
      formEvento.reset();
    } catch (erro) {
      console.error(erro);
      mostrarMensagem('Erro ao salvar evento. Tente novamente.', 'danger');
    }
  });
}

//------------------------------------------------------------------------------------------------------

const listaEventos = document.querySelector('#lista-eventos');

if (listaEventos) {
  const eventosSalvos = JSON.parse(localStorage.getItem('eventosplus-eventos') || '[]');
  const contador = document.querySelector('#contador-eventos');

  if (contador) {
    contador.textContent = eventosSalvos.length
      ? `${eventosSalvos.length} evento(s) cadastrado(s)`
      : 'Nenhum evento cadastrado ainda';
  }

  function formatarData(valor) {
    if (!valor) return '';
    const [ano, mes, dia] = valor.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  if (!eventosSalvos.length) {
    listaEventos.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info mb-0">
          Nenhum evento cadastrado ainda. Vá em <strong>Registrar Eventos</strong> para criar o primeiro.
        </div>
      </div>
    `;
  } else {
    eventosSalvos.forEach((evento, index) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';

      const card = document.createElement('div');
      card.className = 'card h-100';

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const titulo = document.createElement('h5');
      titulo.className = 'card-title';
      titulo.textContent = evento.titulo;

      const dataEl = document.createElement('p'); 
      dataEl.className = 'card-text mb-1';
      dataEl.innerHTML = `<strong>Data:</strong> ${formatarData(evento.data)}`;

      const localEl = document.createElement('p'); 
      localEl.className = 'card-text mb-1';
      localEl.innerHTML = `<strong>Local:</strong> ${evento.local}`;

      const descricao = document.createElement('p');
      descricao.className = 'card-text text-muted';
      descricao.textContent = evento.descricao || 'Sem descrição';

      const organizadoresE1 = document.createElement('p');
      organizadoresE1.className = 'card-text';
      organizadoresE1.innerHTML = `<strong>Organizadores</strong> ${evento.organizadores || 'Não informado'}`;

      const cardFooter = document.createElement('div');
      cardFooter.className = 'card-footer d-flex justify-content-between';

      const btnEditar = document.createElement('button');
      btnEditar.type = 'button';
      btnEditar.className = 'btn btn-sm btn-outline-primary btn-editar';
      btnEditar.dataset.index = index;
      btnEditar.textContent = 'Editar';

      const btnExcluir = document.createElement('button');
      btnExcluir.type = 'button';
      btnExcluir.className = 'btn btn-sm btn-outline-danger btn-excluir';
      btnExcluir.dataset.index = index;
      btnExcluir.textContent = 'Excluir';

      cardFooter.appendChild(btnEditar);
      cardFooter.appendChild(btnExcluir);

      cardBody.appendChild(titulo);
      cardBody.appendChild(dataEl);
      cardBody.appendChild(localEl);
      cardBody.appendChild(descricao);
      cardBody.appendChild(organizadoresE1);

      card.appendChild(cardBody);
      card.appendChild(cardFooter);
      col.appendChild(card);
      listaEventos.appendChild(col);
    });

    listaEventos.addEventListener('click', (event) => {
      const botaoExcluir = event.target.closest('.btn-excluir');
      const botaoEditar = event.target.closest('.btn-editar');

      if (botaoExcluir) {
        const index = Number(botaoExcluir.dataset.index);
        const eventosAtual = JSON.parse(localStorage.getItem('eventosplus-eventos') || '[]');

        if (Number.isInteger(index) && eventosAtual[index]) {
          if (confirm('Tem certeza que deseja excluir este evento?')) {
            eventosAtual.splice(index, 1);
            localStorage.setItem('eventosplus-eventos', JSON.stringify(eventosAtual));
            window.location.reload();
          }
        }
        return;
      }

      if (botaoEditar) {
        const index = Number(botaoEditar.dataset.index);

        if (Number.isInteger(index)) {
          localStorage.setItem('eventosplus-evento-editando', String(index));
          window.location.href = 'event-register.html';
        }
      }
    });
  }
}

//------------------------------------------------------------------------------------------------------

