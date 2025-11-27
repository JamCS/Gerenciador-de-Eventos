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

  const usuario = typeof obterUsuarioLogado === 'function' ? obterUsuarioLogado() : null;
  const usuarioEhAluno = usuario && usuario.perfil === 'aluno';

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

      const organizadoresEl = document.createElement('p');
      organizadoresEl.className = 'card-text';
      organizadoresEl.innerHTML = `<strong>Organizadores:</strong> ${evento.organizadores || 'Não informado'}`;

      cardBody.appendChild(titulo);
      cardBody.appendChild(dataEl);
      cardBody.appendChild(localEl);
      cardBody.appendChild(descricao);
      cardBody.appendChild(organizadoresEl);

      if (!usuarioEhAluno) {
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
        card.appendChild(cardFooter);
      }

      card.appendChild(cardBody);
      col.appendChild(card);
      listaEventos.appendChild(col);
    });

    if (!usuarioEhAluno) {
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
}


//------------------------------------------------------------------------------------------------------

function obterUsuarios() {
  return JSON.parse(localStorage.getItem('eventosplus-usuarios') || '[]');
}

function salvarUsuarios(usuarios) {
  localStorage.setItem('eventosplus-usuarios', JSON.stringify(usuarios));
}

function obterUsuarioLogado() {
  return JSON.parse(localStorage.getItem('eventosplus-usuario-logado') || 'null');
}

function definirUsuarioLogado(usuario) {
  if (usuario) {
    localStorage.setItem('eventosplus-usuario-logado', JSON.stringify(usuario));
  } else {
    localStorage.removeItem('eventosplus-usuario-logado');
  }
}

//------------------------------------------------------------------------------------------------------

const formRegister = document.querySelector('#form-register');

if (formRegister) {
  formRegister.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const nome = document.querySelector('#nome-register').value.trim();
    const email = document.querySelector('#email-register').value.trim().toLowerCase();
    const perfil = document.querySelector('#perfil-register').value;
    const senha = document.querySelector('#senha-register').value;
    const confirmarSenha = document.querySelector('#confirmar-senha').value;
    
    if (!nome || !email || !perfil || !senha || !confirmarSenha) {
      mostrarMensagem('Preencha todos os campos.', 'warning');
      return;
    }
    
    if (senha !== confirmarSenha) {
      mostrarMensagem('As senhas não coincidem.', 'warning');
      return;
    }
    
    const usuarios = obterUsuarios();
    const jaExiste = usuarios.some(u => u.email === email);
    
    if (jaExiste) {
      mostrarMensagem('Já existe uma conta com este e-mail.', 'danger');
      return;
    }
    
    const novoUsuario = {
      id: Date.now(),
      nome,
      email,
      perfil,
      senha //Nota para mim mesmo, lembrar de alterar o modo que a senha é salva (Falha de segurança ou erro de iniciante).
    };
    
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    definirUsuarioLogado(novoUsuario);
    
    mostrarMensagem('Conta criada com sucesso! Redirecionando...', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  });
}

//------------------------------------------------------------------------------------------------------

const formLogin = document.querySelector('#form-login');

if (formLogin) {
  formLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const email = document.querySelector('#email-login').value.trim().toLowerCase();
    const senha = document.querySelector('#senha-login').value;

    if (!email || !senha) {
      mostrarMensagem('Informe e-mail e senha.', 'warning');
      return;
    }

    const usuarios = obterUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (!usuario) {
      mostrarMensagem('E-mail ou senha inválidos.', 'danger');
      return;
    }
    
    definirUsuarioLogado(usuario);
    mostrarMensagem('Login realizado com sucesso! Redirecionando...', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  });
}

//------------------------------------------------------------------------------------------------------

(function protegerRotas() {
  const usuario = obterUsuarioLogado();
  const caminho = window.location.pathname;

  const rotaPrecisaLogin =
    caminho.endsWith('index.html') ||
    caminho.endsWith('event-register.html') ||
    caminho === '/' || caminho === '';

  if (!usuario && rotaPrecisaLogin) {
    window.location.href = 'login.html';
    return;
  }

  if (usuario && usuario.perfil === 'aluno' && caminho.endsWith('event-register.html')) {
    alert('Sua conta de estudante não tem permissão para registrar eventos.');
    window.location.href = 'index.html';
  }
})();

//------------------------------------------------------------------------------------------------------

(function configurarNavbarUsuario() {
  const usuario = obterUsuarioLogado();
  const nomeEl   = document.querySelector('#navbar-user-name');
  const emailEl  = document.querySelector('#navbar-user-email');
  const labelEl  = document.querySelector('#navbar-user-label');
  const btnLogout = document.querySelector('#btn-logout');
  const linkRegister = document.querySelector('#link-register-event');

  if (!usuario) {
    return;
  }

  const primeiroNome = usuario.nome ? usuario.nome.split(' ')[0] : 'Usuário';

  if (nomeEl)  nomeEl.textContent  = usuario.nome || 'Usuário';
  if (emailEl) emailEl.textContent = usuario.email || '';
  if (labelEl) labelEl.textContent = primeiroNome;
  if (usuario.perfil === 'aluno' && linkRegister) {
    linkRegister.classList.add('disabled', 'text-muted');
    linkRegister.removeAttribute('href');
    linkRegister.addEventListener('click', (e) => e.preventDefault());
    linkRegister.textContent = 'Registrar Eventos (restrito)';
  }
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      definirUsuarioLogado(null);
      window.location.href = 'login.html';
    });
  }
})();