# Painel de Governança do Futuro

Prototipo imersivo de currículo interativo para Maria João Abujamra. O experimento combina narrativa provocadora, tokens de habilidade, linha do tempo de atos de coragem e um oráculo de governança movido a IA (placeholder) em uma única página estática.

## Conteúdo
- **Hero/Proposta** com manifesto, CTA e áudio.
- **Ecossistema Vivo** reunindo blog, loja, provocadora, colab Provoca/cao Smile, agentes IA Vertical e fundação.
- **Atos de Coragem** em linha do tempo animada com links para cada momento.
- **Tokens de Habilidade** em estilo NFT-like com modal de detalhe e ações de coleta/troca.
- **Protocolo TDA TCDM** com chatbot conceitual e respostas provocadoras.
- **Conselho de Referência** com validações e imprensa.
- **Contato/Consultoria** com links diretos e formulário.
- **Manifesto** completo ao final.

## Como visualizar rapidamente
- **Opção 1 — abrir direto:** clique duas vezes em `index.html` (ou arraste o arquivo para o navegador). Se o áudio não tocar, use a Opção 2.
- **Opção 2 — prévia com servidor local (recomendada para animações/áudio):**
  1. Abra um terminal na pasta do projeto.
  2. Rode `python -m http.server 8000` (Python já vem no macOS e na maioria das instalações de Windows/Linux).
  3. No navegador, acesse `http://localhost:8000` e pressione **F11** (ou “Entrar em tela cheia”) para ver os efeitos completos.
  4. Para fechar o servidor, volte ao terminal e pressione `Ctrl+C`.
- **Mobile:** com o servidor local rodando, acesse `http://<seu-ip>:8000` no celular na mesma rede Wi‑Fi para validar o layout responsivo.

## Passo a passo para aprovar
1. Execute a Opção 2 acima para garantir animações, áudio e interações de hover.
2. Role a página completa até o manifesto final para conferir todos os links (atos, tokens, referências, colab, fundação e consultoria).
3. Se quiser compartilhar a prévia, compacte a pasta e envie, ou hospede os mesmos arquivos em qualquer serviço de páginas estáticas.

## Próximos passos sugeridos
- Converter para framework (Next.js/Vite) e conectar banco (atos, tokens, chat, validações).
- Integrar autenticação OAuth Manus e papéis admin/usuário.
- Trocar o chatbot mockado por LLM via streaming e historização das mensagens.
- Acrescentar testes (Vitest) e pipeline de deploy.
