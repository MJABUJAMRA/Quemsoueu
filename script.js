const timelineData = [
  {
    title: 'Protocolo de Crescimento Sustentável',
    year: '2024',
    impact: '+230% de expansão orgânica',
    reach: '18 países',
    detail: 'Arquitetura de governança e interoperabilidade para startups em escala global.',
    link: 'https://provocacao.agency/cases/protocolo'
  },
  {
    title: 'Missão de Reestruturação de Mídia',
    year: '2022',
    impact: 'Reestruturação ética e transparente',
    reach: '120M de audiência',
    detail: 'Aplicação de IA generativa para ressignificar narrativas em coletivos criativos.',
    link: 'https://provocacao.blog/atos/midia'
  },
  {
    title: 'Primeira Melodia — Terra da Arte',
    year: '2019',
    impact: 'Fundo cultural multichain',
    reach: '5 hubs criativos',
    detail: 'Projeto Web3 que uniu artistas, colecionadores e tokens de governança.',
    link: 'https://provocacao.store/colecoes/terra-da-arte'
  },
  {
    title: 'Orquestração de Comunidades',
    year: '2015',
    impact: 'Comunidades regenerativas',
    reach: '240 projetos acelerados',
    detail: 'Criação de estruturas autônomas para impacto social mensurável.',
    link: 'https://verticalagents.ai/programs/comunidades'
  }
];

const tokenData = [
  { name: 'Governança Web3', rarity: 'Lendário', xp: 1250, description: 'Protocolos, DAOs e interoperabilidade com accountability.', cta: 'Coletar' },
  { name: 'IA Generativa', rarity: 'Épico', xp: 980, description: 'Prompt engineering, curadoria ética e oráculos alinhados.', cta: 'Trocar' },
  { name: 'Estratégia de Marca', rarity: 'Raro', xp: 760, description: 'Arquétipos, posicionamento e narrativas provocadoras.', cta: 'Coletar' },
  { name: 'Futuros Desejáveis', rarity: 'Mítico', xp: 1500, description: 'Prospectiva estratégica, arte especulativa e Web3.', cta: 'Trocar' },
  { name: 'Operação Dados', rarity: 'Épico', xp: 890, description: 'KPIs, dashboards, accountability e cultura de mensuração.', cta: 'Coletar' },
  { name: 'Missão de Reestruturação', rarity: 'Singular', xp: 1700, description: 'Design de rituais de ética, comunicação e governança.', cta: 'Coletar' }
];

const references = [
  { title: 'Manifesto na Revista Futuro', date: '2024', impact: 'Capa + 3M de alcance', category: 'Imprensa' },
  { title: 'Keynote SXSW — IA Responsável', date: '2023', impact: 'Auditório principal', category: 'Conferência' },
  { title: 'Colab Provoca/cao Smile', date: '2022', impact: 'Campanha transmedia', category: 'Parceria' },
  { title: 'Vertical Agents IA', date: '2021', impact: 'Lançamento de ecossistema de agentes', category: 'IA' }
];

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function renderTimeline() {
  const container = document.getElementById('timeline-grid');
  timelineData.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'timeline-card';
    card.innerHTML = `
      <div class="badge">${item.year}</div>
      <h3>${item.title}</h3>
      <p>${item.detail}</p>
      <p><span class="metric">${item.impact}</span> • Alcance: ${item.reach}</p>
      <a class="cta ghost" href="${item.link}" target="_blank">Ver momento</a>
    `;
    container.appendChild(card);
  });
}

function renderTokens() {
  const container = document.getElementById('token-grid');
  tokenData.forEach((token) => {
    const card = document.createElement('article');
    card.className = 'token-card';
    card.innerHTML = `
      <div class="badge">${token.rarity}</div>
      <h3>${token.name}</h3>
      <p>${token.description}</p>
      <p class="metric">${token.xp} XP</p>
      <div class="token-actions">
        <button>${token.cta}</button>
        <button class="token-detail" data-token="${token.name}">Detalhar</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderReferences() {
  const container = document.getElementById('references-grid');
  references.forEach((ref) => {
    const card = document.createElement('article');
    card.className = 'reference-card';
    card.innerHTML = `
      <div class="badge">${ref.category}</div>
      <h3>${ref.title}</h3>
      <small>${ref.date}</small>
      <p>${ref.impact}</p>
    `;
    container.appendChild(card);
  });
}

function addMessage(content, author = 'bot') {
  const msg = document.createElement('div');
  msg.className = `message ${author}`;
  msg.textContent = content;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function fakeOracleResponse(prompt) {
  const responses = [
    'Transparência radical e dados acionáveis são o início: qual métrica você quer multiplicar?',
    'Interoperabilidade não é sobre tecnologia, é sobre confiança entre humanos e sistemas.',
    'Considere tokens de responsabilidade: cada ação registra accountability em cadeia.',
    'Comece com um piloto: um ato de coragem, uma métrica, um comitê de ética.',
  ];
  const seed = prompt.length % responses.length;
  return responses[seed];
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  addMessage(value, 'user');
  chatInput.value = '';
  setTimeout(() => addMessage(fakeOracleResponse(value)), 400);
});

function handleTokenModal() {
  const modal = document.getElementById('token-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('token-detail')) {
      const tokenName = event.target.getAttribute('data-token');
      const token = tokenData.find((t) => t.name === tokenName);
      if (!token) return;
      modalBody.innerHTML = `
        <p class="badge">${token.rarity}</p>
        <h3>${token.name}</h3>
        <p>${token.description}</p>
        <p class="metric">${token.xp} XP — liberado para colecionar</p>
        <small>Troque tokens entre pares ou desbloqueie mentorias privadas.</small>
      `;
      modal.removeAttribute('hidden');
      document.body.classList.add('modal-open');
    }

    if (event.target === modal) {
      modal.setAttribute('hidden', 'hidden');
      document.body.classList.remove('modal-open');
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.setAttribute('hidden', 'hidden');
    document.body.classList.remove('modal-open');
  });
}

function setupReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
}

function setupParallax() {
  const elements = document.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.08;
    elements.forEach((el) => {
      el.style.transform = `translateY(${offset}px)`;
    });
  });
}

function setupCtaScroll() {
  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-scroll');
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function setupCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  window.addEventListener('pointermove', (event) => {
    glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });
}

renderTimeline();
renderTokens();
renderReferences();
setupReveals();
setupParallax();
setupCtaScroll();
setupCursorGlow();
handleTokenModal();
addMessage('Sou o Oráculo de Governança. Qual ato de coragem deseja executar hoje?');
