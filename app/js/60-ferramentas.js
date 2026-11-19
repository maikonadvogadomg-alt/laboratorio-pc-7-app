/* Laboratório — 60-ferramentas.js: 🧰 AS SUAS FERRAMENTAS NUM LUGAR SÓ.
   Cada ferramenta é um HTML que funciona sozinho (pasta ferramentas/). Abre aqui dentro
   e continua guardando os próprios dados. "↗ Tela própria" abre numa aba só dela. */
(function (LB) {
  'use strict';
  const { $, esc } = LB;
  const FERR = [
    { id: 'montador', icone: '🧩', nome: 'Montador Universal', arq: 'montador.html', desc: 'Abre qualquer arquivo (PDF, Word, Excel…) e cria modelos de regras por linha.' },
    { id: 'picotador', icone: '✂️', nome: 'Picotador de Memória', arq: 'picotador.html', desc: 'Corta e divide memórias, backups e conversas grandes em pedaços.' },
    { id: 'faxina', recebe: true, icone: '🧹', nome: 'Faxina de Repetidos', arq: 'faxina.html', desc: 'Tira arquivos repetidos de zips e pastas, dá nome pelo título e separa por tipo.' },
    { id: 'arrumador', icone: '🗃', nome: 'Arrumador de Backups', arq: 'arrumador.html', desc: 'Junta backups (Jurídico, Colador, memórias do Mini SK), separa por projeto/data.' },
    { id: 'numerador', recebe: true, icone: '🔢', nome: 'Numerador de Códigos', arq: 'numerador.html', desc: 'Junta muitos HTML, tira repetidos e parecidos, e baixa numerados com índice.' },
    { id: 'preparador', recebe: true, icone: '🧰', nome: 'Preparador Universal', arq: 'preparador.html', desc: 'Prepara qualquer projeto (até monorepo do Replit) para .exe, APK e Netlify.' },
    { id: 'banco', icone: '🗄', nome: 'Banco de Dados (Neon)', arq: 'banco-neon.html', desc: 'Cole o endereço do Neon: tabelas, o que tem dentro, baixar tudo, criar tabelas. Comando que apaga pede CONFIRMO.' },
    { id: 'colador', icone: '🔗', nome: 'Colador de Links', arq: 'colador.html', desc: 'Guarda e abre os links das suas versões. 📌 Fixar os links no arquivo: eles voltam mesmo se apagar tudo.' },
    { id: 'meuchat', icone: '💬', nome: 'Meu Chat (tela inteira)', arq: 'meu-chat/index.html', desc: 'O seu chat com as suas chaves, 🦙 Ollama, voz, memória, internet e fotos. (Também está na aba 🤖 IA.)' },
  ];
  // os códigos que você trouxe (feitos pelo Claude antigo / outras IAs) — do jeito que vieram
  const SEUS = [
    { id: 'aistudio', icone: '🤖', nome: 'AI Code Studio', arq: 'ai-code-studio.html', desc: 'Chat com várias IAs, memória e editor de código.' },
    { id: 'projetolab', recebe: true, icone: '🧪', nome: 'Projeto Lab', arq: 'projeto-lab.html', desc: 'O laboratório antigo do Claude.' },
    { id: 'replicador', recebe: true, icone: '🧬', nome: 'Replicador de Projeto', arq: 'replicador.html', desc: 'Replica a estrutura de um projeto.' },
    { id: 'iara', icone: '🌊', nome: 'Iara Suite', arq: 'iara-suite.html', desc: 'Code Editor · APK Builder · Site Extractor.' },
    { id: 'cacabug', recebe: true, icone: '🐞', nome: 'Caça-Bug (inteiro, com terminal)', arq: 'cacabug/index.html', desc: 'O Caça-Bug aqui dentro: diagnóstico, Raio-X, Triagem, Cirurgião, comparar com quando funcionava, zip limpo, terminal e o 🤖 chat. Recebe o projeto escolhido.' },
    { id: 'lab2', recebe: true, icone: '🔬', nome: 'Laboratório 2 (o do outro Claude)', arq: 'laboratorio2/index.html', desc: 'O outro laboratório, inteiro, aqui dentro: Gerenciador, Raio-X, Mapa, Biblioteca, Combinar… Recebe o projeto escolhido.' },
    { id: 'juntador', recebe: true, icone: '🧷', nome: 'Juntador de Arquivos', arq: 'juntador.html', desc: 'Junta arquivos.' },
  ];
  const KITS = [
    { icone: '📦', nome: 'Kit do Replit', arq: 'kit-replit.cjs', desc: 'Roda dentro do Replit: relatório, pacote limpo, build. Shell: node kit-replit.cjs 5' },
    { icone: '🟢', nome: 'Servidorzinho', arq: 'servir.py', desc: 'Abre qualquer app montado como o Replit abre. PC ou Termux: python servir.py' },
    { icone: '📱', nome: 'Organizador do Celular', arq: 'organizar.py', desc: 'Termux: acha repetidos no celular inteiro; só apaga quando você escreve APAGAR.' },
    { icone: '🧩', nome: 'Juntar', arq: 'juntar.py', desc: 'Transforma um projeto em pedaços (index + css + js) num HTML único.' },
    { icone: '🧱', nome: 'Montar (montar.py)', arq: 'receita-montar/montar.py', desc: 'Junta várias ferramentas HTML num app só, como o Caça-Bug. PC ou Termux: python montar.py' },
    { icone: '📖', nome: 'Receita do montar', arq: 'receita-montar/RECEITA-MONTAR.md', desc: 'O passo a passo do montar.py, para você ou para a IA seguir.' },
    { icone: '🤖', nome: 'Pedido pronto para a IA', arq: 'receita-montar/PEDIDO-PARA-A-IA.txt', desc: 'Cole na IA do Mini SK para ela montar as suas ferramentas com o montar.py.' },
    { icone: '🧾', nome: 'Receita (receita.json)', arq: 'receita-montar/receita.json', desc: 'A lista de ferramentas que o montar.py junta. Edite para escolher as suas.' },
    { icone: '🧽', nome: 'Faxina rápida do PC (.zip)', arq: 'faxina-rapida.zip', desc: 'Windows: limpa temporários e mostra o que ocupa espaço. Abra o ABRIR-FAXINA.bat. Não apaga nada seu sem perguntar.' },
    { icone: '🧼', nome: 'Painel de faxina PC + celular (.zip)', arq: 'faxina-painel.zip', desc: 'Windows: painel com botões (ABRIR-FAXINA-PC.bat) e uma página para o celular. Leia o LEIA-ME antes.' },
    { icone: '🗣', nome: 'Voz Francisco (voz-francisco.py)', arq: 'voz-francisco.py', desc: 'A voz grátis para o celular (Termux) ou um PC sem os programas. No Laboratório, Mini SK e Jurídico do PC ela já vem dentro.' },
  ];
  let aberta = '';
  const el = () => $('#panel-ferramentas');
  const achar = (id) => FERR.concat(SEUS).find((x) => x.id === id);
  const cartao = (f) => '<button class="ferr-card" data-abrir="' + f.id + '"><span class="ferr-ic">' + f.icone + '</span><b>' + esc(f.nome) + '</b><small>' + esc(f.desc) + '</small></button>';

  function tela() {
    const e = el(); if (!e) return;
    if (aberta) return abrir(aberta);
    e.innerHTML =
      '<div class="card"><h2>🧰 Ferramentas</h2><p class="muted">As suas ferramentas, todas aqui dentro. Cada uma guarda os próprios dados.</p></div>' +
      '<div class="ferr-grade">' + FERR.map(cartao).join('') + '</div>' +
      '<h3 class="ferr-grupo">📂 Seus códigos (do jeito que vieram)</h3>' +
      '<div class="ferr-grade">' + SEUS.map(cartao).join('') + '</div>' +
      '<h3 class="ferr-grupo">🧳 Kits para baixar (rodam fora do navegador)</h3>' +
      '<div class="ferr-kits">' + KITS.map((k) => '<div class="ferr-kit"><span class="ferr-ic">' + k.icone + '</span><div><b>' + esc(k.nome) + '</b> <code>' + esc(k.arq) + '</code><br><small class="muted">' + esc(k.desc) + '</small></div><button class="btn s" data-kit="' + esc(k.arq) + '">⤓ Baixar</button></div>').join('') + '</div>';
  }
  function abrir(id) {
    const f = achar(id); if (!f) { aberta = ''; return tela(); }
    aberta = id;
    el().innerHTML = '<div class="linha ferr-barra"><button class="btn" data-voltar="1">← Ferramentas</button><b>' + f.icone + ' ' + esc(f.nome) + '</b><span class="cresce"></span>' + (podeMandar(f) ? '<button class="btn s p" data-mandar="' + f.id + '" title="Entrega o projeto escolhido no topo para esta ferramenta, sem importar de novo">📥 Mandar o projeto</button>' : '') + '<button class="btn s" data-propria="' + f.id + '">↗ Tela própria</button></div>' +
      '<iframe class="ferr-quadro" title="' + esc(f.nome) + '" src="ferramentas/' + f.arq + '" allow="microphone; camera; clipboard-read; clipboard-write; fullscreen; autoplay; web-share"></iframe>';
    // 15/11: a caixa ocupa SÓ o espaço que sobra na tela (antes ficava mais alta e a parte de escrever caía para fora no celular)
    setTimeout(() => { encaixar(); const q = el().querySelector('.ferr-quadro'); if (q) q.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 60);
    // 17/11: igual ao Caça-Bug — as ferramentas que recebem projeto já abrem com o projeto escolhido no topo
    const q = el().querySelector('.ferr-quadro');
    if (q && f.recebe && LB.atual) q.addEventListener('load', () => setTimeout(() => mandar(f, true), 500), { once: true });
  }
  // ---------- 📥 MANDAR O PROJETO para dentro da ferramenta (17/11) ----------
  // Não muda as ferramentas: acha o botão de "escolher arquivo" delas e entrega o projeto ali,
  // como se você tivesse escolhido. Se ela aceita .zip → vai o .zip; se aceita vários → vão os arquivos soltos.
  const NAO_MANDA = ['banco', 'colador', 'meuchat', 'aistudio', 'iara', 'picotador'];
  const podeMandar = (f) => !NAO_MANDA.includes(f.id);
  async function zipDoProjeto(p, W) {
    const z = new JSZip(); let n = 0;
    Object.entries(p.arquivos || {}).forEach(([k, v]) => { if (v && typeof v.t === 'string') { z.file(k, v.t); n++; } });
    if (!n) throw new Error('o projeto não tem arquivos de texto');
    const b = await z.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
    return new W.File([new W.Uint8Array(b)], (p.nome || 'projeto').replace(/[^\wÀ-ÿ.-]+/g, '-').replace(/^-+|-+$/g, '') + '.zip', { type: 'application/zip' });
  }
  function soltos(p, W) {
    const tipo = (k) => /\.html?$/i.test(k) ? 'text/html' : /\.css$/i.test(k) ? 'text/css' : /\.m?js$/i.test(k) ? 'text/javascript' : /\.json$/i.test(k) ? 'application/json' : 'text/plain';
    return Object.entries(p.arquivos || {}).filter(([, v]) => v && typeof v.t === 'string').map(([k, v]) => { const fl = new W.File([v.t], k.split('/').pop(), { type: tipo(k) }); try { Object.defineProperty(fl, 'webkitRelativePath', { value: (p.nome || 'projeto') + '/' + k }); } catch (e) {} return fl; });
  }
  async function mandar(f, sozinho) {
    const p = LB.projeto(LB.atual);
    if (!p) { if (!sozinho) LB.aviso('Escolha um projeto no topo (📂 Projeto) primeiro.', 'erro'); return; }
    const q = el() && el().querySelector('.ferr-quadro'); if (!q) return;
    let W, D; try { W = q.contentWindow; D = q.contentDocument; } catch (e) {}
    if (!W || !D) { LB.aviso('Não consegui falar com esta ferramenta.', 'erro'); return; }
    try {
      // 0) app que sabe receber (Caça-Bug): não duplica o projeto
      if (typeof W.__receber === 'function') { await W.__receber(await zipDoProjeto(p, W)); LB.aviso('📥 Projeto "' + p.nome + '" entregue ao ' + f.nome + '.', 'ok'); return; }
      // 1) ferramenta preparada (tem __hub.abrir, como no Caça-Bug)
      if (W.__hub && typeof W.__hub.abrir === 'function') { await W.__hub.abrir(await zipDoProjeto(p, W), 'A'); LB.aviso('📥 Projeto "' + p.nome + '" entregue ao ' + f.nome + '.', 'ok'); return; }
      // 2) o botão de escolher arquivo dela
      const ins = [...D.querySelectorAll('input[type=file]')].filter((i) => !/\.json$|^\.json|image\/|audio\/|video\//i.test(i.accept || '') || /zip|html/i.test(i.accept || ''));
      const comZip = ins.find((i) => /zip/i.test(i.accept || ''));
      const varios = ins.find((i) => i.multiple && !i.webkitdirectory && (!i.accept || /html|\.js|\*|text/i.test(i.accept)));
      const pasta = ins.find((i) => i.webkitdirectory);
      const alvo = comZip || varios || pasta || ins.find((i) => !i.accept) || ins[0];
      if (!alvo) { if (!sozinho) LB.aviso('Esta ferramenta não tem onde receber projeto. Use o botão de importar dela.', 'erro'); return; }
      const dt = new W.DataTransfer();
      if (alvo === comZip || (!alvo.multiple && !alvo.webkitdirectory)) dt.items.add(await zipDoProjeto(p, W));
      else soltos(p, W).forEach((x) => dt.items.add(x));
      const qtos = dt.files.length; // (a ferramenta pode limpar a caixa depois de ler)
      alvo.files = dt.files;
      alvo.dispatchEvent(new W.Event('input', { bubbles: true }));
      alvo.dispatchEvent(new W.Event('change', { bubbles: true }));
      LB.aviso('📥 Projeto "' + p.nome + '" entregue ao ' + f.nome + (qtos > 1 ? ' (' + qtos + ' arquivos soltos)' : ' (.zip)') + '.', 'ok');
    } catch (e) { LB.aviso('⚠ Não consegui entregar: ' + e.message + ' — use o botão de importar da ferramenta.', 'erro'); }
  }
  function encaixar() {
    const q = el() && el().querySelector('.ferr-quadro'); if (!q) return;
    const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    const barra = el().querySelector('.ferr-barra'); const hb = barra ? barra.getBoundingClientRect().height : 0;
    q.style.height = Math.max(420, Math.round(vh - hb - 16)) + 'px';
  }
  window.addEventListener('resize', encaixar);
  async function kit(arq) {
    try {
      const r = await fetch('kits/' + arq); if (!r.ok) throw new Error('não achei ' + arq);
      LB.baixar(arq.split('/').pop(), await r.blob());
    } catch (e) { LB.aviso('⚠ ' + e.message + ' (abra o Laboratório publicado ou pelo Mini SK)', 'erro'); }
  }
  document.addEventListener('click', (e) => {
    const box = el(); if (!box || !box.contains(e.target)) return;
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.abrir) abrir(b.dataset.abrir);
    if (b.dataset.mandar) mandar(achar(b.dataset.mandar));
    if (b.dataset.voltar) { aberta = ''; tela(); }
    if (b.dataset.propria) window.open('ferramentas/' + achar(b.dataset.propria).arq, '_blank');
    if (b.dataset.kit) kit(b.dataset.kit);
  });
  window.addEventListener('lab-aba', (e) => { if (e.detail === 'ferramentas' && !el().innerHTML) tela(); });
  LB.ferramentas = { tela, abrir, lista: FERR.concat(SEUS) };
})(window.LB);
/* 17/11: trocou o projeto no topo com uma ferramenta aberta → ela recebe o novo (só as que recebem projeto) */
(function (LB) {
  window.addEventListener('lab-projeto', () => {
    const b = document.querySelector('#panel-ferramentas [data-mandar]');
    const q = document.querySelector('#panel-ferramentas .ferr-quadro');
    if (b && q && /laboratorio2|cacabug|faxina|numerador|preparador|projeto-lab|replicador|juntador/.test(q.getAttribute('src') || '')) setTimeout(() => b.click(), 200);
  });
})(window.LB);
