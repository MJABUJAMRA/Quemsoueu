import React, { useState, useEffect, useRef } from 'react';

const NeuralNetwork = ({ color }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 1
    }));
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n, i) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
        nodes.slice(i + 1).forEach(o => {
          const d = Math.hypot(n.x - o.x, n.y - o.y);
          if (d < 120) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(o.x, o.y); ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${0.15 * (1 - d / 120)})`); ctx.stroke(); }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, [color]);
  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}} />;
};

const BlockchainBrain = ({ color, size = 150, onClick, clickable = false }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200"
         style={{ margin: '30px auto', display: 'block', cursor: clickable ? 'pointer' : 'default' }}
         onClick={onClick}>
      <path d="M100 20 Q140 20 160 50 Q180 80 170 120 Q160 150 130 165 Q100 180 70 165 Q40 150 30 120 Q20 80 40 50 Q60 20 100 20"
        fill="none" stroke={color} strokeWidth="2" opacity="0.4"/>
      <path d="M100 40 Q130 45 145 70 Q160 95 150 120 Q140 145 115 155 Q100 160 85 155 Q60 145 50 120 Q40 95 55 70 Q70 45 100 40"
        fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>

      {[[60,60,80,80],[80,80,100,90],[100,90,120,80],[120,80,140,60],[50,80,80,80],[80,80,70,100],[70,100,85,120],
        [150,80,120,80],[120,80,130,100],[130,100,115,120],[100,50,100,90],[100,90,100,140],[85,120,115,120]].map(([x1,y1,x2,y2],i) => (
        <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" opacity="0.3" className="blockchain-line" style={{animationDelay:`${i*0.1}s`}}/>
      ))}

      {[{x:100,y:50},{x:80,y:60},{x:120,y:60},{x:60,y:60},{x:140,y:60},{x:50,y:80},{x:80,y:80},{x:100,y:90},{x:120,y:80},{x:150,y:80},
        {x:70,y:100},{x:130,y:100},{x:85,y:120},{x:100,y:130},{x:115,y:120},{x:100,y:140}].map((n,i) => (
        <g key={`n${i}`}>
          <circle cx={n.x} cy={n.y} r={4} fill={color} className="blockchain-node" style={{animationDelay:`${i*0.1}s`}}/>
          <rect x={n.x-2} y={n.y-2} width={4} height={4} fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" className="blockchain-cube" style={{animationDelay:`${i*0.1}s`}}/>
        </g>
      ))}
    </svg>
  );
};

const socialTokens = [
  { name: "LOJA", icon: "◈", link: "https://reserva.ink/aprovocadora", color: "#ff6b35", desc: "MODA FILOSÓFICA" },
  { name: "FUNDAÇÃO", icon: "◎", link: "https://fundacaoweb3.org", color: "#00ff88", desc: "WEB3 DAO" },
  { name: "LINKEDIN", icon: "◉", link: "https://www.linkedin.com/in/mjabu/", color: "#0077b5", desc: "NETWORK" },
  { name: "INSTAGRAM", icon: "◐", link: "https://instagram.com/mjabujamra", color: "#E4405F", desc: "@MJABUJAMRA" },
];

const SpinningToken = ({ token, index }) => {
  const [h, setH] = useState(false);
  return (
    <a href={token.link} target="_blank" rel="noopener noreferrer" className="spin-token" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{'--tc': token.color, '--delay': `${index * 0.2}s`, animationPlayState: h ? 'paused' : 'running'}}>
      <div className="tface tfront"><span className="ticon">{token.icon}</span><span className="tname">{token.name}</span></div>
      <div className="tface tback"><span className="tdesc">{token.desc}</span><span className="tarrow">→</span></div>
    </a>
  );
};

const GlassToken = ({ children, delay = 0, onClick, active, tc }) => {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className={`gtoken ${active ? 'active' : ''}`} style={{ animationDelay: `${delay}s`, '--gc': tc }}>
      {children}
    </div>
  );
};

const experiences = [
  { id: 1, title: "PROTOCOLO TDA TCDM", impact: "FUNDAÇÃO WEB3 DAO", tags: ["DAO", "BLOCKCHAIN"], link: "https://fundacaoweb3.org" },
  { id: 2, title: "A PROVOCADORA", impact: "MODA FILOSÓFICA WEB3", tags: ["FASHION", "NFT"], link: "https://reserva.ink/aprovocadora" },
  { id: 3, title: "1ª ENGENHEIRA GEMMA", impact: "PIONEIRA IA GENERATIVA", tags: ["LLM", "ML"], link: null },
  { id: 4, title: "1M EM 20 MIN", impact: "VIRAL REVOLUTION", tags: ["VIRAL", "NOKIA"], link: "https://exame.com/marketing/campanha-da-nokia-defende-o-amor-diz-criadora-do-viral/" },
  { id: 5, title: "GUINNESS RECORD", impact: "HOPI HARI", tags: ["GESTÃO", "RECORDE"], link: null },
  { id: 6, title: "VP iG PORTAL", impact: "INTEGRAÇÃO DIGITAL", tags: ["MÍDIA", "VP"], link: "https://portalimprensa.com.br/noticias/brasil/75629/jornalista-e-publicitaria-maria-joao-abujamra-assume-vice-presidencia-de-operacoes-do-ig" },
  { id: 7, title: "SNOOP DOGG BR", impact: "CONEXÃO GLOBAL", tags: ["HIP-HOP"], link: null },
  { id: 8, title: "MEIRELLES FILM", impact: "CINEMA PIONEIRO", tags: ["CINEMA"], link: null },
  { id: 9, title: "A FAZENDA #1", impact: "AUTENTICIDADE", tags: ["TV", "REALITY"], link: "https://vejasp.abril.com.br/coluna/terraco-paulistano/maria-joao-abujamra-nao-queria-enganar-ninguem/" },
];

const projects = [
  { name: "PRIMEIRA MELODIA", desc: "IA MUSICAL", status: "BUILD", link: null },
  { name: "LOJA PROVOCADORA", desc: "MODA FILOSÓFICA", status: "LIVE", link: "https://reserva.ink/aprovocadora" },
  { name: "HUB PROVOCADORA", desc: "CENTRO WEB3", status: "ACTIVE", link: null },
  { name: "TERRA DA ARTE", desc: "NFT BRASIL", status: "BUILD", link: null },
  { name: "SMILE AGENCY", desc: "PROPÓSITO", status: "ACTIVE", link: null },
  { name: "PRAIA.AI", desc: "OCEAN MONITOR", status: "BUILD", link: null },
  { name: "BVBART", desc: "TROCA TOKEN", status: "SOON", link: null }
];

const llmSkills = ["PROMPT ENGINEERING", "FINE-TUNING", "RAG", "COT", "MULTI-MODAL", "AGENTS", "GEMMA", "CLAUDE", "EMBEDDINGS", "VECTOR DB", "ALIGNMENT", "EVAL"];

export default function NeuralPortfolio() {
  const [section, setSection] = useState('intro');
  const [showManifesto, setShowManifesto] = useState(false);
  const [theme, setTheme] = useState('white');
  const [menuOpen, setMenuOpen] = useState(false);
  const [glitchText, setGlitchText] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [manifestoWords, setManifestoWords] = useState(['','','','']);
  const [showManifestoContent, setShowManifestoContent] = useState(false);

  useEffect(() => {
    if (section === 'intro') {
      const text = "MARIA JOÃO ABUJAMRA";
      let it = 0;
      const iv = setInterval(() => {
        setGlitchText(text.split('').map((ch, i) => i < it ? ch : String.fromCharCode(65 + Math.floor(Math.random() * 26))).join(''));
        it += 0.5;
        if (it >= text.length) clearInterval(iv);
      }, 40);
      return () => clearInterval(iv);
    }
  }, [section]);

  useEffect(() => {
    if (showManifesto) {
      setManifestoWords(['','','','']);
      setShowManifestoContent(false);

      const words = currentManifesto.bigWords;
      words.forEach((word, index) => {
        setTimeout(() => {
          let iteration = 0;
          const interval = setInterval(() => {
            const animated = word.split('').map((char, i) => {
              if (char === ' ') return ' ';
              if (i < iteration) return char;
              return String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }).join('');

            setManifestoWords(prev => {
              const newWords = [...prev];
              newWords[index] = animated;
              return newWords;
            });

            iteration += 0.5;
            if (iteration >= word.length) {
              clearInterval(interval);
              setManifestoWords(prev => {
                const newWords = [...prev];
                newWords[index] = word;
                return newWords;
              });

              if (index === words.length - 1) {
                setTimeout(() => setShowManifestoContent(true), 500);
              }
            }
          }, 40);
        }, index * 1500);
      });
    }
  }, [showManifesto]);

  const triggerManifesto = () => {
    setShowManifesto(true);
  };

  const closeManifesto = () => {
    setShowManifesto(false);
    setSection('intro');
  };

  const goToPoemas = () => {
    setShowManifesto(false);
    setSection('poemas');
  };

  const themes = {
    white: { bg: '#f0f0f0', primary: '#000', text: '#000', glass: 'rgba(255,255,255,0.6)', neural: 'rgba(0,0,0,0.08)' },
    green: { bg: '#001a00', primary: '#00ff88', text: '#00ff88', glass: 'rgba(0,255,136,0.1)', neural: 'rgba(0,255,136,0.12)' },
    black: { bg: '#000', primary: '#fff', text: '#fff', glass: 'rgba(255,255,255,0.08)', neural: 'rgba(255,255,255,0.06)' }
  };
  const c = themes[theme];

  const manifestoContent = {
    white: {
      title: "QUEM SOU EU",
      bigWords: ["AUDAZES", "VISIONÁRIOS", "DISSIDENTES", "POETAS DA AÇÃO"],
      paragraphs: [
        "Em um universo traçado pelas linhas do convencional, resplandecem, como astros desgarrados, os audazes – aqueles que trilham descalços sobre as cinzas do ordinário. São eles que exalam paixão e se expressam em linguagens de fervor, que percebem o mundo não em sua forma atual, mas em seu potencial.",
        "Estes são os visionários, os dissidentes, os poetas da ação, que detêm o futuro nas palmas das mãos hesitantes e o reescrevem a cada movimento ousado.",
        "E no epicentro desta tempestade de transformação, ressoa um clamor: o amor é uma forma de arte. Amar este planeta em sofrimento constitui o ato mais subversivo, mais destemido de todos.",
        "Que os audazes ascendam ao palco! Pois em um mundo que flerta com o esquecimento, são os audazes, os corajosos, os artistas de alma incendiária, que possuem o poder não apenas de alterar o mundo, mas de salvá-lo."
      ],
      signature: "— Maria João Abujamra"
    },
    green: {
      bigWords: ["VOCÊ", "FAZ PARTE", "DA NATUREZA", "CUIDE DELA"],
      paragraphs: [],
      signature: null
    },
    black: {
      title: "MISSÃO",
      bigWords: ["INTEROPERABILIDADE", "LIBERDADE", "INOVAÇÃO", "FUTURO"],
      paragraphs: [
        "Proponho uma reflexão sobre o futuro, inspirada pela dinâmica de mudanças no Brasil e no cenário global.",
        "Idealizo uma comunidade que, de forma crível, relevante, competitiva e disruptiva, interaja com o ecossistema.",
        "É imperativo fundir o infungível.",
        "Interoperabilidade, na busca incessante pela verdade e pela liberdade de existir."
      ],
      signature: "Maria João Abujamra"
    }
  };

  const currentManifesto = manifestoContent[theme];

  return (
    <div style={{ backgroundColor: c.bg, color: c.text, minHeight: '100vh', fontFamily: "'SF Mono', 'Monaco', monospace", position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .tsw { position: fixed; top: 20px; right: 20px; display: flex; gap: 8px; z-index: 1000; }
        .tbtn { width: 28px; height: 28px; border-radius: 50%; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; }
        .tbtn:hover { transform: scale(1.2); }
        .menu-trig { position: fixed; top: 20px; left: 20px; display: flex; align-items: center; gap: 8px; padding: 10px 20px; border: 1px solid; border-radius: 30px; cursor: pointer; z-index: 1000; backdrop-filter: blur(10px); }
        .menu-pan { position: fixed; top: 70px; left: 20px; padding: 15px; border-radius: 15px; border: 1px solid; z-index: 1000; backdrop-filter: blur(30px); min-width: 180px; background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); }
        .menu-it { padding: 12px 15px; cursor: pointer; font-size: 11px; letter-spacing: 2px; border-radius: 8px; transition: all 0.3s; }
        .menu-it:hover { background: rgba(128,128,128,0.2); }
        .intro-sec { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; z-index: 1; }
        .term { max-width: 700px; width: 100%; backdrop-filter: blur(30px); border-radius: 15px; overflow: hidden; background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .term-h { display: flex; align-items: center; gap: 8px; padding: 12px 15px; background: rgba(0,0,0,0.3); }
        .term-d { width: 12px; height: 12px; border-radius: 50%; }
        .term-b { padding: 40px; }
        .term-l { font-size: 11px; margin-bottom: 8px; letter-spacing: 1px; opacity: 0; animation: fadeIn 0.5s forwards; }
        .term-l:nth-child(1) { animation-delay: 0.2s; }
        .term-l:nth-child(2) { animation-delay: 0.4s; }
        .term-l:nth-child(3) { animation-delay: 0.6s; }
        .gname { font-size: clamp(28px, 7vw, 50px); font-weight: bold; letter-spacing: 3px; margin: 30px 0 15px; }
        .subtitle { font-size: 11px; letter-spacing: 4px; margin-bottom: 25px; opacity: 0.6; }
        .badges { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 30px; }
        .badge { padding: 6px 12px; border: 1px solid; font-size: 9px; letter-spacing: 1px; border-radius: 3px; }
        .enter-btn { padding: 15px 35px; border: 2px solid; background: transparent; font-size: 12px; letter-spacing: 3px; cursor: pointer; font-family: inherit; transition: all 0.3s; }
        .enter-btn:hover { transform: scale(1.05); }

        .poem-sec { min-height: 100vh; padding: 100px 40px; position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
        .poem-hdr { text-align: center; margin-bottom: 40px; }
        .poem-ttl { font-size: clamp(50px, 15vw, 150px); font-weight: 100; letter-spacing: -3px; line-height: 0.9; opacity: 0.15; }
        .poem-ttl-acc { font-weight: 700; opacity: 0.25; }
        .brain-cnt { position: relative; width: 350px; height: 350px; margin: 20px auto; }
        .brain-svg { width: 100%; height: 100%; }
        .nn { animation: pulse 2s ease-in-out infinite; }
        .nl { animation: lineGlow 3s ease-in-out infinite; }
        .poem-cnt { max-width: 800px; text-align: center; }
        .poem-box { padding: 40px; margin-bottom: 30px; backdrop-filter: blur(30px); border: 1px solid; border-radius: 15px; background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); }
        .poem-txt { font-size: 18px; line-height: 2; font-style: italic; opacity: 0.8; }
        .poem-auth { margin-top: 20px; font-size: 11px; letter-spacing: 4px; opacity: 0.5; }
        .sec { min-height: 100vh; padding: 100px 30px; position: relative; z-index: 1; }
        .sec-ttl { font-size: clamp(24px, 5vw, 40px); font-weight: bold; letter-spacing: 4px; text-align: center; margin-bottom: 8px; }
        .sec-sub { font-size: 10px; letter-spacing: 4px; text-align: center; margin-bottom: 50px; opacity: 0.5; }
        .tok-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 15px; max-width: 1100px; margin: 0 auto; }
        .gtoken { padding: 25px; backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; cursor: pointer; transition: all 0.4s; animation: float 4s ease-in-out infinite; background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); }
        .gtoken:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .gtoken.active { box-shadow: 0 0 50px var(--gc); }
        .tok-num { font-size: 36px; font-weight: bold; opacity: 0.15; margin-bottom: 8px; }
        .tok-ttl { font-size: 13px; font-weight: bold; letter-spacing: 2px; margin-bottom: 5px; }
        .tok-imp { font-size: 10px; letter-spacing: 2px; margin-bottom: 12px; opacity: 0.7; }
        .tok-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .tok-tag { font-size: 8px; opacity: 0.5; }
        .tok-link { font-size: 9px; letter-spacing: 2px; text-decoration: none; }
        .proj-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; max-width: 900px; margin: 0 auto 50px; }
        .proj-card { padding: 20px; backdrop-filter: blur(25px); border: 1px solid; border-radius: 10px; text-align: center; transition: all 0.3s; background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); text-decoration: none; color: inherit; display: block; }
        .proj-card:hover { transform: translateY(-5px); }
        .proj-st { font-size: 8px; letter-spacing: 2px; margin-bottom: 8px; }
        .proj-nm { font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; }
        .proj-desc { font-size: 9px; opacity: 0.6; }
        .llm-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; max-width: 800px; margin: 0 auto 40px; }
        .llm-sk { padding: 15px; backdrop-filter: blur(25px); border: 1px solid; border-radius: 8px; text-align: center; font-size: 10px; font-weight: bold; letter-spacing: 1px; transition: all 0.3s; background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); }
        .llm-sk:hover { transform: scale(1.08); }
        .gov-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; max-width: 900px; margin: 0 auto 40px; }
        .gov-card { padding: 25px; backdrop-filter: blur(25px); border: 1px solid; border-radius: 10px; text-align: center; background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); transition: all 0.3s; }
        .gov-card:hover { transform: translateY(-3px); }
        .gov-ic { font-size: 24px; margin-bottom: 12px; }
        .gov-ttl { font-size: 12px; font-weight: bold; letter-spacing: 2px; margin-bottom: 8px; }
        .gov-desc { font-size: 11px; opacity: 0.7; line-height: 1.5; }
        .quote-box { max-width: 600px; margin: 0 auto 40px; padding: 30px; backdrop-filter: blur(30px); border: 1px solid; border-radius: 10px; background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); }
        .quote-txt { font-size: 14px; line-height: 1.7; font-style: italic; }
        .quote-auth { margin-top: 15px; font-size: 11px; letter-spacing: 3px; }
        .cta-sec { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
        .cta-btn { padding: 14px 35px; font-size: 11px; letter-spacing: 2px; text-decoration: none; border-radius: 5px; transition: all 0.3s; cursor: pointer; border: none; }
        .cta-btn:hover { transform: scale(1.05); }
        .soc-tok-sec { display: flex; justify-content: center; gap: 25px; flex-wrap: wrap; padding: 40px 20px; perspective: 1000px; }
        .spin-token { width: 120px; height: 150px; position: relative; transform-style: preserve-3d; animation: spinTok 8s ease-in-out infinite; animation-delay: var(--delay); cursor: pointer; text-decoration: none; color: inherit; }
        .spin-token:hover { animation: none; transform: rotateY(180deg) scale(1.1); }
        .tface { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 15px; backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.15); background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)); box-shadow: 0 8px 32px rgba(0,0,0,0.25); }
        .tfront { border-top: 2px solid var(--tc); }
        .tback { transform: rotateY(180deg); border-bottom: 2px solid var(--tc); }
        .ticon { font-size: 32px; margin-bottom: 10px; color: var(--tc); text-shadow: 0 0 15px var(--tc); }
        .tname { font-size: 11px; font-weight: bold; letter-spacing: 2px; color: var(--tc); }
        .tdesc { font-size: 9px; letter-spacing: 1px; opacity: 0.8; text-align: center; padding: 0 10px; }
        .tarrow { font-size: 20px; margin-top: 10px; color: var(--tc); }
        @keyframes spinTok { 0% { transform: rotateY(0deg); } 25% { transform: rotateY(180deg); } 50% { transform: rotateY(180deg); } 75% { transform: rotateY(360deg); } 100% { transform: rotateY(360deg); } }
        .footer { padding: 25px; text-align: center; border-top: 1px solid; position: relative; z-index: 1; }
        .footer-txt { font-size: 10px; letter-spacing: 3px; margin-bottom: 8px; }
        .footer-hash { font-size: 8px; opacity: 0.3; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        .blockchain-node { animation: pulse 2s ease-in-out infinite; }
        .blockchain-line { animation: lineGlow 3s ease-in-out infinite; }
        .blockchain-cube { animation: rotate3d 4s linear infinite; }

        @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes lineGlow { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
        @keyframes rotate3d { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <NeuralNetwork color={c.neural} />

      <div className="tsw">
        <button className="tbtn" onClick={() => setTheme('white')} style={{ backgroundColor: '#fff', borderColor: theme === 'white' ? '#000' : '#ccc' }} />
        <button className="tbtn" onClick={() => setTheme('green')} style={{ backgroundColor: '#00ff88', borderColor: theme === 'green' ? '#fff' : '#003' }} />
        <button className="tbtn" onClick={() => setTheme('black')} style={{ backgroundColor: '#000', borderColor: theme === 'black' ? '#fff' : '#333' }} />
      </div>

      <div className="menu-trig" onClick={() => setMenuOpen(!menuOpen)} style={{ borderColor: c.primary, backgroundColor: c.glass }}>
        <span style={{ fontSize: '14px', color: c.primary }}>◎</span>
        <span style={{ fontSize: '10px', letterSpacing: '2px' }}>NEURAL</span>
      </div>

      {menuOpen && (
        <nav className="menu-pan" style={{ backgroundColor: c.glass, borderColor: `${c.primary}33` }}>
          <div className="menu-it" onClick={() => { setSection('intro'); setMenuOpen(false); }}>◉ INÍCIO</div>
          <div className="menu-it" onClick={() => { setSection('poemas'); setMenuOpen(false); }}>◈ POEMAS MENTAIS</div>
          <div className="menu-it" onClick={() => { setSection('tokens'); setMenuOpen(false); }}>◇ HISTÓRIA</div>
          <div className="menu-it" onClick={() => { setSection('ecosystem'); setMenuOpen(false); }}>◎ PROJETOS</div>
          <div className="menu-it" onClick={() => { setSection('llm'); setMenuOpen(false); }}>◐ NEURAL</div>
          <div className="menu-it" onClick={() => { setSection('governance'); setMenuOpen(false); }}>◆ GOVERNANÇA</div>
          <div className="menu-it" onClick={() => { setSection('connect'); setMenuOpen(false); }}>→ CONEXÕES</div>
        </nav>
      )}

      {section === 'intro' && !showManifesto && (
        <section className="intro-sec">
          <div className="term" style={{ backgroundColor: c.glass, border: `1px solid ${c.primary}22` }}>
            <div className="term-h" style={{ borderBottom: `1px solid ${c.primary}22` }}>
              <span className="term-d" style={{ backgroundColor: c.primary, opacity: 0.3 }} />
              <span className="term-d" style={{ backgroundColor: c.primary, opacity: 0.5 }} />
              <span className="term-d" style={{ backgroundColor: c.primary, opacity: 0.8 }} />
              <span style={{ marginLeft: 'auto', fontSize: '10px', letterSpacing: '2px', opacity: 0.5 }}>CONSCIÊNCIA_v3.0</span>
            </div>
            <div className="term-b">
              <div className="term-l" style={{ color: c.primary }}>→ INICIANDO CONSCIÊNCIA...</div>
              <div className="term-l" style={{ color: c.primary }}>→ CARREGANDO PADRÕES NEURAIS...</div>
              <div className="term-l" style={{ color: c.primary }}>→ CONECTANDO À WEB3...</div>
              <h1 className="gname" style={{ color: c.primary, textShadow: theme === 'green' ? '0 0 20px #00ff88' : 'none' }}>{glitchText || "MARIA JOÃO ABUJAMRA"}</h1>
              <div className="subtitle">GOVERNANÇA DO FUTURO · IA GENERATIVA · WEB3</div>
              <div className="badges">
                <span className="badge" style={{ borderColor: c.primary, color: c.primary }}>BLOCKCHAIN</span>
                <span className="badge" style={{ borderColor: c.primary, color: c.primary }}>DESCENTRALIZADO</span>
                <span className="badge" style={{ borderColor: c.primary, color: c.primary }}>IA NATIVA</span>
              </div>
              <button className="enter-btn" onClick={triggerManifesto} style={{ borderColor: c.primary, color: c.primary }}>MANIFESTO</button>
            </div>
          </div>
        </section>
      )}

      {showManifesto && (
        <div style={{position:'fixed',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',backgroundColor:c.bg,zIndex:2000,overflowY:'auto',padding:'80px 40px 100px'}}>
          {currentManifesto.title && <div style={{fontSize:14,letterSpacing:6,color:c.primary,marginBottom:40,textAlign:'center'}}>{currentManifesto.title}</div>}

          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:15,marginBottom:50,width:'100%',maxWidth:'900px'}}>
            {manifestoWords.map((word, i) => (
              <span key={i} style={{fontSize:'clamp(32px, 8vw, 70px)',fontWeight:'bold',color:c.primary,letterSpacing:8,lineHeight:1.2,textAlign:'center',wordBreak:'break-word'}}>{word}</span>
            ))}
          </div>

          {showManifestoContent && currentManifesto.paragraphs.length > 0 && (
            <div style={{maxWidth:800,margin:'40px auto',opacity:0,animation:'fadeIn 1s forwards'}}>
              {currentManifesto.paragraphs.map((para, i) => (
                <p key={i} style={{fontSize:14,color:c.text,lineHeight:1.9,marginBottom:25,textAlign:'justify'}}>{para}</p>
              ))}
            </div>
          )}

          {showManifestoContent && currentManifesto.signature && (
            <div style={{fontSize:16,color:c.primary,letterSpacing:3,textAlign:'center',margin:'40px 0',fontWeight:'bold',opacity:0,animation:'fadeIn 1s 0.5s forwards'}}>{currentManifesto.signature}</div>
          )}

          {showManifestoContent && (
            <div style={{opacity:0,animation:'fadeIn 1s 1s forwards',textAlign:'center'}}>
              <BlockchainBrain color={c.primary} size={150} />
              <div style={{display:'flex',gap:15,justifyContent:'center',marginTop:30,flexWrap:'wrap'}}>
                <button onClick={closeManifesto} style={{padding:'14px 28px',fontSize:11,letterSpacing:2,border:`1px solid ${c.primary}`,background:'transparent',borderRadius:5,color:c.primary,cursor:'pointer',transition:'all 0.3s'}}>
                  ← VOLTAR
                </button>
                <button onClick={goToPoemas} style={{padding:'14px 28px',fontSize:11,letterSpacing:2,border:`1px solid ${c.primary}`,background:c.primary,borderRadius:5,color:c.bg,cursor:'pointer',transition:'all 0.3s'}}>
                  EXPLORAR CÉREBRO →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {section === 'poemas' && (
        <section className="poem-sec">
          <div className="poem-hdr">
            <div className="poem-ttl" style={{ color: c.primary }}>POEMAS</div>
            <div className="poem-ttl poem-ttl-acc" style={{ color: c.primary }}>MENTAIS</div>
          </div>
          <div className="brain-cnt">
            <svg viewBox="0 0 400 400" className="brain-svg">
              <path d="M200 50 Q280 50 320 120 Q360 180 340 250 Q320 320 260 350 Q200 380 140 350 Q80 320 60 250 Q40 180 80 120 Q120 50 200 50" fill="none" stroke={c.primary} strokeWidth="1" opacity="0.3"/>
              <path d="M200 80 Q260 90 290 140 Q320 190 300 250 Q280 300 230 320 Q200 330 170 320 Q120 300 100 250 Q80 190 110 140 Q140 90 200 80" fill="none" stroke={c.primary} strokeWidth="0.5" opacity="0.2"/>
              {[[120,140,160,180],[160,180,200,200],[200,200,240,180],[240,180,280,140],[100,180,160,180],[160,180,140,220],[140,220,170,260],[300,180,240,180],[240,180,260,220],[260,220,230,260],[200,100,200,200],[200,200,200,300],[170,260,230,260]].map(([x1,y1,x2,y2],i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.primary} strokeWidth="0.5" opacity="0.3" className="nl" style={{animationDelay:`${i*0.2}s`}}/>
              ))}
              {[{x:200,y:100},{x:160,y:120},{x:240,y:120},{x:120,y:140},{x:280,y:140},{x:100,y:180},{x:160,y:180},{x:200,y:200},{x:240,y:180},{x:300,y:180},{x:140,y:220},{x:260,y:220},{x:170,y:260},{x:200,y:280},{x:230,y:260},{x:200,y:300}].map((n,i) => (
                <circle key={i} cx={n.x} cy={n.y} r={i===7?8:5} fill={c.primary} className="nn" style={{animationDelay:`${i*0.15}s`}}/>
              ))}
            </svg>
          </div>
          <div className="poem-cnt">
            <div className="poem-box" style={{ borderColor: `${c.primary}22`, backgroundColor: c.glass }}>
              <p className="poem-txt" style={{ color: c.text }}>"Quando me dei conta da GOVERNANÇA DO FUTURO, pensei: posso escrever a lei, descentralizada. A melhor maneira de saber o futuro é construí-lo, e eu vou!"</p>
              <div className="poem-auth" style={{ color: c.primary }}>— MARIA JOÃO ABUJAMRA</div>
            </div>
            <div className="poem-box" style={{ borderColor: `${c.primary}22`, backgroundColor: c.glass }}>
              <p className="poem-txt" style={{ color: c.text }}>"Somos a última geração antes da IA dominar o mundo. Títulos rígidos são limitantes. Não há departamentos, nomenclaturas. Apenas talentos, ideias e resultados."</p>
            </div>
            <div className="poem-box" style={{ borderColor: `${c.primary}22`, backgroundColor: c.glass }}>
              <p className="poem-txt" style={{ color: c.text }}>"É imperativo fundir o infungível. Não existe terminologia para descrever este sentimento. Uma nova geração está engajada na maior missão de todos os tempos."</p>
            </div>
          </div>
        </section>
      )}

      {section === 'tokens' && (
        <section className="sec">
          <h2 className="sec-ttl" style={{ color: c.primary }}>TOKENS DE HISTÓRIA</h2>
          <p className="sec-sub">CADA MOMENTO · UM NFT · VERIFICÁVEL</p>
          <div className="tok-grid">
            {experiences.map((exp, i) => (
              <GlassToken key={exp.id} delay={i*0.1} onClick={() => setSelectedToken(selectedToken?.id === exp.id ? null : exp)} active={selectedToken?.id === exp.id} tc={c.primary}>
                <div className="tok-num" style={{ color: c.primary }}>#{String(i+1).padStart(3,'0')}</div>
                <div className="tok-ttl" style={{ color: c.text }}>{exp.title}</div>
                <div className="tok-imp" style={{ color: c.primary }}>{exp.impact}</div>
                <div className="tok-tags">{exp.tags.map((t,j) => <span key={j} className="tok-tag" style={{ color: c.text }}>#{t}</span>)}</div>
                {exp.link && <a href={exp.link} target="_blank" onClick={(e) => e.stopPropagation()} className="tok-link" style={{ color: c.primary }}>VERIFY →</a>}
              </GlassToken>
            ))}
          </div>
        </section>
      )}

      {section === 'ecosystem' && (
        <section className="sec">
          <h2 className="sec-ttl" style={{ color: c.primary }}>ECOSSISTEMA</h2>
          <p className="sec-sub">PROJETOS · COMUNIDADE · FUTURO</p>
          <div className="proj-grid">
            {projects.map((p, i) => (
              p.link ? (
                <a key={i} href={p.link} target="_blank" className="proj-card" style={{ backgroundColor: c.glass, borderColor: p.status === 'LIVE' ? '#ff6b35' : `${c.primary}33`, borderWidth: p.status === 'LIVE' ? '2px' : '1px', color: c.text }}>
                  <div className="proj-st" style={{ color: p.status === 'LIVE' ? '#ff6b35' : p.status === 'ACTIVE' ? '#00ff88' : c.primary }}>{p.status === 'LIVE' ? '● LIVE' : p.status}</div>
                  <div className="proj-nm">{p.name}</div>
                  <div className="proj-desc">{p.desc}</div>
                  <div style={{ fontSize: '9px', marginTop: '8px', color: '#ff6b35', letterSpacing: '2px' }}>ACESSAR →</div>
                </a>
              ) : (
                <div key={i} className="proj-card" style={{ backgroundColor: c.glass, borderColor: `${c.primary}33`, color: c.text }}>
                  <div className="proj-st" style={{ color: p.status === 'ACTIVE' ? '#00ff88' : c.primary }}>{p.status}</div>
                  <div className="proj-nm">{p.name}</div>
                  <div className="proj-desc">{p.desc}</div>
                </div>
              )
            ))}
          </div>
          <div className="cta-sec">
            <a href="https://reserva.ink/aprovocadora" target="_blank" className="cta-btn" style={{ backgroundColor: '#ff6b35', color: '#fff' }}>LOJA PROVOCADORA</a>
            <a href="https://fundacaoweb3.org" target="_blank" className="cta-btn" style={{ backgroundColor: c.primary, color: c.bg }}>FUNDAÇÃO WEB3</a>
          </div>
        </section>
      )}

      {section === 'llm' && (
        <section className="sec">
          <h2 className="sec-ttl" style={{ color: c.primary }}>EXPERTISE NEURAL</h2>
          <p className="sec-sub">ESPECIALISTA EM LARGE LANGUAGE MODELS</p>
          <div className="llm-grid">
            {llmSkills.map((s, i) => <div key={i} className="llm-sk" style={{ backgroundColor: c.glass, borderColor: `${c.primary}33`, color: c.primary, textShadow: theme === 'green' ? '0 0 10px #00ff88' : 'none' }}>{s}</div>)}
          </div>
          <div className="quote-box" style={{ backgroundColor: c.glass, borderColor: `${c.primary}33` }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', color: c.primary, marginBottom: '15px' }}>PRIMEIRA ENGENHEIRA GEMMA NO BRASIL</div>
            <p style={{ fontSize: '12px', lineHeight: 1.7, opacity: 0.8, color: c.text }}>Treinamento de modelos, fine-tuning, prompt engineering avançado, criação de agentes autônomos, RAG systems, e arquitetura de soluções IA.</p>
          </div>
        </section>
      )}

      {section === 'governance' && (
        <section className="sec">
          <h2 className="sec-ttl" style={{ color: c.primary }}>METODOLOGIA</h2>
          <p className="sec-sub">GOVERNANÇA DESCENTRALIZADA</p>
          <div className="gov-grid">
            {[{i:'◈',t:'DAO',d:'Decisões coletivas. Transparência total.'},{i:'◎',t:'ESG',d:'Impacto ambiental. Responsabilidade.'},{i:'◐',t:'BLOCKCHAIN',d:'Imutabilidade. Rastreabilidade.'},{i:'◇',t:'AI ETHICS',d:'IA ética. Humanos no controle.'}].map((g,i) => (
              <div key={i} className="gov-card" style={{ backgroundColor: c.glass, borderColor: `${c.primary}33` }}>
                <div className="gov-ic" style={{ color: c.primary }}>{g.i}</div>
                <div className="gov-ttl" style={{ color: c.text }}>{g.t}</div>
                <div className="gov-desc" style={{ color: c.text }}>{g.d}</div>
              </div>
            ))}
          </div>
          <div className="quote-box" style={{ backgroundColor: c.glass, borderColor: `${c.primary}33` }}>
            <p className="quote-txt" style={{ color: c.text }}>"Títulos rígidos tendem a ser limitantes, fomentando obsessão corporativa por cargos em detrimento de talentos, ideias e resultados."</p>
            <div className="quote-auth" style={{ color: c.primary }}>— MARIA JOÃO ABUJAMRA</div>
          </div>
          <div className="cta-sec">
            <button onClick={() => setSection('connect')} className="cta-btn" style={{ backgroundColor: c.primary, color: c.bg }}>CONECTAR</button>
          </div>
        </section>
      )}

      {section === 'connect' && (
        <section className="sec" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="sec-ttl" style={{ color: c.primary }}>CONEXÕES</h2>
          <p className="sec-sub">TOKENS DE ACESSO · CLIQUE PARA ENTRAR</p>
          <div className="soc-tok-sec" style={{ marginTop: '40px' }}>
            {socialTokens.map((t, i) => <SpinningToken key={i} token={t} index={i} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ fontSize: '12px', letterSpacing: '3px', opacity: 0.5, color: c.text }}>CADA TOKEN É UMA PORTA · CADA PORTA É UMA OPORTUNIDADE</p>
          </div>
        </section>
      )}

      <footer className="footer" style={{ backgroundColor: c.glass, borderColor: `${c.primary}22` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
          <span onClick={() => setSection('connect')} style={{ fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', opacity: 0.7, color: c.text }}>◆ CONEXÕES</span>
        </div>
        <div className="footer-txt" style={{ color: c.text }}>INTEROPERABILIDADE É A MISSÃO</div>
        <div className="footer-hash" style={{ color: c.text }}>HASH: 0x{Math.random().toString(16).substr(2, 24)}...</div>
      </footer>
    </div>
  );
}
