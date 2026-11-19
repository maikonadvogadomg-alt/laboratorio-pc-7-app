/* Laboratório — 98x-raiox.js: 🔍 RAIO-X DE APK e de .EXE (e de zip de projeto)
   Abre um .apk (ou .zip/.aab) SEM instalar, olha por dentro e faz um RELATÓRIO em português:
   - que tipo de app é (Capacitor, Cordova, React Native, Flutter, site embrulhado…);
   - se ele só abre um SITE da internet (server.url) — aí "funciona sem servidor" porque usa o servidor de lá;
   - endereços de internet e rotas /api que o app chama; bibliotecas que usa;
   - COMO ELE IMPORTA arquivo (PDF.js, Tesseract/OCR, envia para o servidor…);
   - chaves que ficaram dentro (mostradas MASCARADAS).
   Botões: ⬇ relatório .md · 📋 copiar · ⬇ baixar desmontado (.zip) · ➕ abrir a parte web como projeto do Laboratório. */
(function (LB) {
  'use strict';
  const { $, esc } = LB;
  let ultimo = null; // { nome, zip, rel, web: {caminho: texto} }
  let anterior = null; // 17/11: a versão analisada antes — para ⚖️ comparar

  const BIBLIOTECAS = [[/pdfjs|pdf\.worker|getDocument\(/i, 'PDF.js (lê PDF no próprio aparelho)'], [/tesseract/i, 'Tesseract (OCR: lê texto de imagem/PDF escaneado no aparelho)'], [/mammoth/i, 'Mammoth (lê Word .docx)'], [/jszip/i, 'JSZip (zip)'], [/docx|Packer\.toBlob/i, 'docx (gera Word)'], [/jspdf/i, 'jsPDF (gera PDF)'], [/react(-dom)?\b|__REACT|createRoot\(/i, 'React'], [/vue\b|createApp\(/i, 'Vue'], [/@capacitor|Capacitor\./, 'Capacitor (ponte com o celular)'], [/cordova/i, 'Cordova'], [/firebase/i, 'Firebase'], [/supabase/i, 'Supabase'], [/neon\.tech|@neondatabase/i, 'Neon (banco)'], [/generativelanguage\.googleapis|@google\/genai|gemini/i, 'Gemini'], [/api\.openai\.com/i, 'OpenAI'], [/api\.groq\.com/i, 'Groq'], [/openrouter\.ai/i, 'OpenRouter'], [/anthropic/i, 'Claude/Anthropic'], [/speechSynthesis|SpeechRecognition/, 'Voz do aparelho'], [/datajud|api-publica\.datajud/i, 'DataJud (CNJ)'], [/comunicaapi\.pje|pje\.jus\.br|jus\.br/i, 'PJe / Jus.br'], [/replit\.(app|dev|co)/i, 'Replit (endereço)'], [/netlify\.app/i, 'Netlify (endereço)'], [/vercel\.app/i, 'Vercel (endereço)']];
  const IMPORTA = [[/extract-text|\/upload/i, 'manda o arquivo para o SERVIDOR ler (rota de upload/extract-text)'], [/getDocument\(|pdfjsLib/i, 'lê o PDF NO APARELHO com PDF.js'], [/tesseract|recognize\(/i, 'faz OCR NO APARELHO com Tesseract (lento em PDF grande)'], [/FileReader|readAsArrayBuffer|\.arrayBuffer\(\)/, 'abre o arquivo no aparelho (FileReader)'], [/FormData\(/, 'monta envio de arquivo (FormData)'], [/maxSize|MAX_FILE|fileSize|\b50\s*\*\s*1024\s*\*\s*1024|52428800/i, 'tem LIMITE de tamanho de arquivo no código']];
  const SEGREDOS = [/AIza[0-9A-Za-z_\-]{30,}/g, /\bsk-(?:or-v1-|proj-|ant-)?[A-Za-z0-9_\-]{20,}/g, /\bgsk_[A-Za-z0-9]{20,}/g, /\beyJ[A-Za-z0-9_\-]{15,}\.[A-Za-z0-9_\-]{15,}\.[A-Za-z0-9_\-]{10,}/g, /postgres(?:ql)?:\/\/[^\s"'`]+/g, /-----BEGIN [A-Z ]*PRIVATE KEY-----/g];
  const mascara = (s) => s.length <= 10 ? '••••' : s.slice(0, 6) + '••••' + s.slice(-3);
  const kb = (n) => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
  const TEXTO = /\.(html?|js|mjs|cjs|css|json|txt|md|xml|map|ts|tsx|svg|webmanifest)$/i;

  async function examinar(arquivo) {
    try { const cab = new Uint8Array(await arquivo.slice(0, 2).arrayBuffer()); if (cab[0] === 0x4d && cab[1] === 0x5a) return examinarExe(arquivo); } catch (e) {}
    if (!window.JSZip) throw new Error('Sem o JSZip.');
    const zip = await JSZip.loadAsync(arquivo);
    const ents = Object.values(zip.files).filter((f) => !f.dir);
    const nomes = ents.map((f) => f.name);
    const tam = (f) => (f._data && f._data.uncompressedSize) || 0;
    const total = ents.reduce((a, f) => a + tam(f), 0);
    const tem = (re) => nomes.some((n) => re.test(n));
    let tipo = 'não reconheci (pode ser um app nativo Java/Kotlin)', raizWeb = '';
    if (tem(/^assets\/public\/index\.html$/)) { tipo = 'Capacitor — um site (HTML/JS) dentro de um app'; raizWeb = 'assets/public/'; }
    else if (tem(/^assets\/www\/index\.html$/)) { tipo = 'Cordova — um site (HTML/JS) dentro de um app'; raizWeb = 'assets/www/'; }
    else if (tem(/index\.android\.bundle$/)) {
      // 15/11: apps feitos no EAS (Expo) são React Native; o código costuma vir COMPILADO (Hermes) — não dá para ler como texto
      const fb = zip.files[nomes.find((n) => /index\.android\.bundle$/.test(n))];
      let hermes = false; try { const cab = await fb.async('uint8array'); hermes = cab[0] === 0xc6 && cab[1] === 0x1f && cab[2] === 0xbc && cab[3] === 0x03; } catch (e) {}
      const expo = tem(/^assets\/app\.(config|manifest)/) || tem(/expo/i);
      tipo = (expo ? 'Expo / EAS (React Native)' : 'React Native') + (hermes ? ' — código COMPILADO (Hermes): não dá para ler nem consertar por aqui; o conserto é no PROJETO ORIGINAL e gerar de novo no EAS' : ' — código em JavaScript (dá para ler, mas é espremido)');
    }
    else if (tem(/libflutter\.so$/)) tipo = 'Flutter';
    else if (tem(/^index\.html$/) || tem(/^[^/]+\/index\.html$/)) { tipo = 'zip de projeto/site (não é APK)'; raizWeb = nomes.find((n) => /(^|\/)index\.html$/.test(n)).replace(/index\.html$/, ''); }
    else if (tem(/^res\//) && tem(/classes\d*\.dex$/) && !tem(/^assets\//)) tipo = 'app que só abre um site (TWA/WebView) — a tela fica na internet, não no APK';
    // configurações do Capacitor/Cordova
    let config = null, configTxt = '';
    for (const c of ['assets/capacitor.config.json', 'capacitor.config.json', 'assets/app.config', 'assets/app.manifest', 'assets/www/config.xml', 'res/xml/config.xml']) if (zip.files[c]) { try { configTxt = await zip.files[c].async('string'); if (/\.json$|app\.(config|manifest)$/.test(c)) { config = JSON.parse(configTxt); if (config && !config.appName && config.name) { config.appName = config.name; config.appId = (config.android && config.android.package) || config.slug; } } } catch (e) {} break; }
    // ler os textos da parte web
    const web = {}; let lidos = 0;
    for (const f of ents) {
      if (!TEXTO.test(f.name) || tam(f) > (/\.map$/.test(f.name) ? 40e6 : 15e6)) continue; // 17/11: o .map pode ser grande (ele guarda o código original)
      if (raizWeb && !f.name.startsWith(raizWeb) && !/^assets\//.test(f.name)) continue;
      if (lidos > 120e6) break;
      const t = await f.async('string'); lidos += t.length; web[f.name] = t;
    }
    const tudo = Object.entries(web).filter(([n]) => !/\.map$/.test(n)).map(([, t]) => t).join('\n');
    const urls = {}; (tudo.match(/https?:\/\/[A-Za-z0-9.\-]+(?::\d+)?(?:\/[^\s"'`)<>\\]*)?/g) || []).forEach((u) => { u = u.replace(/[.,;]+$/, ''); if (/w3\.org|reactjs\.org|schema\.org|mozilla\.org|github\.com\/[^/]+\/[^/]+\/(issues|blob)|fb\.me|tailwindcss|googleapis\.com\/css|fonts\.g|unpkg\.com|cdnjs|jsdelivr|example\.com|localhost\b/i.test(u)) return; const h = u.split('/').slice(0, 3).join('/'); urls[h] = (urls[h] || 0) + 1; });
    const rotas = [...new Set((tudo.match(/["'`]\/api\/[A-Za-z0-9_\-/:{}.]+/g) || []).map((r) => r.slice(1)))].sort();
    const libs = BIBLIOTECAS.filter(([re]) => re.test(tudo)).map(([, n]) => n);
    const importa = IMPORTA.filter(([re]) => re.test(tudo)).map(([, n]) => n);
    const segredos = []; SEGREDOS.forEach((re) => (tudo.match(re) || []).forEach((s) => { const m = mascara(s); if (!segredos.includes(m)) segredos.push(m); }));
    const limites = [...new Set((tudo.match(/(\d{1,4})\s*\*\s*1024\s*\*\s*1024/g) || []))].slice(0, 8);
    const pastas = {}; ents.forEach((f) => { const p = f.name.split('/').slice(0, f.name.startsWith('assets/') ? 2 : 1).join('/'); pastas[p] = (pastas[p] || 0) + tam(f); });
    const serverUrl = config && config.server && config.server.url;
    const r = [];
    r.push('# 🔍 Raio-X de ' + arquivo.name + ' (' + new Date().toLocaleString('pt-BR') + ')', '');
    r.push('## Resumo em português');
    r.push('- **Tipo:** ' + tipo);
    if (config) r.push('- **Nome do app:** ' + (config.appName || '?') + ' · **identificador:** ' + (config.appId || '?') + (config.webDir ? ' · pasta da tela: ' + config.webDir : ''));
    if (serverUrl) r.push('- ⚠️ **Este app NÃO usa a tela que está dentro dele: ele abre o site ' + serverUrl + '.** Ou seja, tudo (inclusive importar) roda no servidor desse endereço. Por isso ele "não dá erro de servidor": o servidor é o de lá, na internet. Se esse site sair do ar, o app para.');
    else if (raizWeb) r.push('- A tela fica **dentro** do APK, em `' + raizWeb + '`.');
    r.push('- **Arquivos:** ' + ents.length + ' · **tamanho aberto:** ' + kb(total));
    r.push('- **Como ele importa arquivo:** ' + (importa.length ? importa.join('; ') : 'não achei sinal de importação'));
    if (limites.length) r.push('- **Limites de tamanho achados no código:** ' + limites.join(', ') + ' (ex.: "50 * 1024 * 1024" = 50 MB)');
    r.push('- **Usa:** ' + (libs.length ? libs.join(', ') : '—'));
    r.push('', '## Endereços de internet que ele chama');
    const us = Object.entries(urls).sort((a, b) => b[1] - a[1]).slice(0, 40);
    r.push(us.length ? us.map(([u, n]) => '- ' + u + ' (' + n + 'x)').join('\n') : '- nenhum');
    r.push('', '## Rotas /api que a tela usa (' + rotas.length + ')');
    r.push(rotas.length ? rotas.slice(0, 120).map((x) => '- `' + x + '`').join('\n') + (rotas.length > 120 ? '\n- …' : '') : '- nenhuma');
    r.push('', '## 🔑 Chaves/senhas que ficaram dentro (mascaradas)');
    r.push(segredos.length ? segredos.map((s) => '- ' + s).join('\n') + '\n\n> ⚠️ Se alguma for sua e ainda valer, troque ela no site de origem: quem tem o APK consegue ler.' : '- nenhuma encontrada ✅');
    r.push('', '## Pastas (o que ocupa espaço)');
    r.push(Object.entries(pastas).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([p, t]) => '- ' + p + ' — ' + kb(t)).join('\n'));
    if (configTxt) r.push('', '## Configuração do app', '```', configTxt.replace(/("(?:apiKey|key|token|secret|password)"\s*:\s*")[^"]+/gi, '$1••••').slice(0, 4000), '```');
    // 17/11: 📖 frases, 🧠 instruções da IA, 🗺 código original pelo .map, 🧹 código espremido
    const mais = LB.raioxMais ? LB.raioxMais.analisar(web) : null;
    if (mais) r.push(...mais.linhas);
    if (ultimo) anterior = ultimo;
    ultimo = { nome: arquivo.name.replace(/\.(apk|aab|zip)$/i, ''), zip, rel: r.join('\n') + '\n', web, raizWeb, mais,
      cmp: { nome: arquivo.name, tipo: tipo.split(' — ')[0], nArq: ents.length, importa, libs, rotas, hosts: Object.keys(urls), limites,
        frases: mais ? mais.frases : [], prompts: mais ? mais.prompts : [], originais: mais ? mais.orig.arquivos : {} } };
    return ultimo;
  }


  // ---------- 15/11: .EXE (Windows) — descobre COMO foi feito; se for Python (PyInstaller), lista e tira os arquivos de dentro ----------
  async function inflar(u8) { try { const ds = new DecompressionStream('deflate'); const b = new Blob([u8]).stream().pipeThrough(ds); return new Uint8Array(await new Response(b).arrayBuffer()); } catch (e) { return null; } }
  function textoAscii(u8, de, ate) { let s = ''; for (let i = de; i < ate; i++) s += String.fromCharCode(u8[i]); return s; }
  async function examinarExe(arquivo) {
    const u8 = new Uint8Array(await arquivo.arrayBuffer());
    const total = u8.length;
    const busca = (txt, de = 0) => { const alvo = Array.from(txt).map((c) => c.charCodeAt(0)); outer: for (let i = de; i <= u8.length - alvo.length; i++) { for (let j = 0; j < alvo.length; j++) if (u8[i + j] !== alvo[j]) continue outer; return i; } return -1; };
    const temTexto = (txt) => { const amostra = textoAscii(u8, 0, Math.min(u8.length, 4e6)) + textoAscii(u8, Math.max(0, u8.length - 4e6), u8.length); return amostra.includes(txt); };
    const r = ['# 🔍 Raio-X de ' + arquivo.name + ' (' + new Date().toLocaleString('pt-BR') + ')', '', '## Resumo em português'];
    const dados = {};
    // PyInstaller: "MEI\x0c\x0b\x0a\x0b\x0e" no fim do arquivo
    let cookie = -1; const fim = Math.max(0, total - 1048576);
    for (let i = total - 8; i >= fim; i--) { if (u8[i] === 0x4d && u8[i + 1] === 0x45 && u8[i + 2] === 0x49 && u8[i + 3] === 0x0c && u8[i + 4] === 0x0b && u8[i + 5] === 0x0a && u8[i + 6] === 0x0b && u8[i + 7] === 0x0e) { cookie = i; break; } }
    if (cookie >= 0) {
      const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
      const lenPkg = dv.getUint32(cookie + 8, false), tocOff = dv.getUint32(cookie + 12, false), tocLen = dv.getUint32(cookie + 16, false), pyver = dv.getUint32(cookie + 20, false);
      const pylib = textoAscii(u8, cookie + 24, cookie + 88).replace(/\0.*$/, '');
      const ini = cookie + 88 - lenPkg; // início do pacote (formato novo, com nome da DLL)
      const tipos = { s: 'programa (script)', m: 'módulo', M: 'pacote', b: 'binário (.dll/.pyd)', z: 'pacote PYZ (os .py compilados)', x: 'arquivo de dados', o: 'opção', d: 'dependência', n: 'símbolo' };
      const ents = []; let p = ini + tocOff;
      while (p < ini + tocOff + tocLen && ents.length < 20000) {
        const tam = dv.getUint32(p, false); if (!tam) break;
        const off = dv.getUint32(p + 4, false), clen = dv.getUint32(p + 8, false), ulen = dv.getUint32(p + 12, false), comp = u8[p + 16], tipo = String.fromCharCode(u8[p + 17]);
        const nome = new TextDecoder().decode(u8.subarray(p + 18, p + tam)).replace(/\0+$/, '');
        ents.push({ nome, tipo, off: ini + off, clen, ulen, comp }); p += tam;
      }
      const ver = String(pyver).length >= 3 ? String(pyver)[0] + '.' + String(pyver).slice(1) : String(pyver);
      r.push('- **Feito com:** **PyInstaller** — ele junta o **Python inteiro + o seu programa + as bibliotecas** num .exe só. Quando você abre, ele desempacota numa pasta temporária e roda. Por isso tem ~' + Math.round(total / 1048576) + ' MB: a maior parte é o próprio Python.');
      r.push('- **Python ' + ver + '** (' + (pylib || '?') + ')');
      const scripts = ents.filter((e) => e.tipo === 's' && !/^pyi|pyiboot|pyimod/i.test(e.nome));
      r.push('- **Programa principal:** ' + (scripts.map((e) => e.nome + '.py').join(', ') || '?') + '  _(vem compilado — o texto original do .py não fica dentro do .exe)_');
      const bins = ents.filter((e) => e.tipo === 'b').map((e) => e.nome);
      const libs = [...new Set(bins.map((n) => (n.split(/[\\/]/)[0] || n).replace(/\.(pyd|dll|so)$/i, '')).filter((n) => !/^(python\d+|vcruntime|api-ms|ucrtbase|msvcp|libcrypto|libssl|libffi|_ssl|_socket|select|unicodedata|_hashlib|_bz2|_lzma|_ctypes|_decimal|_queue|_overlapped|_asyncio|_elementtree|pyexpat|_multiprocessing|_uuid|base_library)/i.test(n)))].slice(0, 60);
      r.push('- **Bibliotecas que ele leva junto:** ' + (libs.join(', ') || '—'));
      const pistas = [[/tkinter|_tkinter|tcl/i, 'Tkinter (janelas)'], [/PyQt|PySide|Qt5|Qt6/i, 'Qt (janelas)'], [/flask|werkzeug|jinja/i, 'Flask (um servidorzinho web por dentro)'], [/fastapi|uvicorn|starlette/i, 'FastAPI/Uvicorn (servidor web por dentro)'], [/webview|pywebview|cef/i, 'pywebview (abre uma tela HTML numa janela)'], [/eel/i, 'Eel (tela HTML + Python)'], [/pdfplumber|PyPDF|fitz|pymupdf|pdfminer/i, 'leitura de PDF'], [/pytesseract|easyocr/i, 'OCR'], [/docx/i, 'Word'], [/requests|urllib3|httpx/i, 'acessa a internet'], [/sqlite3|_sqlite/i, 'banco SQLite (arquivo)'], [/psycopg|pg8000/i, 'banco Postgres (Neon)'], [/openai|anthropic|google\.generativeai|groq/i, 'IA']];
      const todosNomes = ents.map((e) => e.nome).join(' ');
      const usa = pistas.filter(([re]) => re.test(todosNomes)).map(([, t]) => t);
      if (usa.length) r.push('- **Sinais do que ele faz:** ' + usa.join(', '));
      r.push('', '## O "segredo" do .exe pequeno', 'Não tem mágica: o PyInstaller pega o Python + o programa + só as bibliotecas usadas e embrulha tudo num arquivo. Para fazer igual com o código original: `pip install pyinstaller` e depois `pyinstaller --onefile --noconsole programa.py` — o .exe sai na pasta dist.', '');
      // arquivos de dados (HTML, JSON, imagens…) — dá para tirar
      const xs = ents.filter((e) => e.tipo === 'x');
      r.push('## Arquivos de dados dentro (' + xs.length + ')');
      for (const e of xs.slice(0, 400)) {
        let bytes = u8.subarray(e.off, e.off + e.clen);
        if (e.comp) { const d = await inflar(bytes); if (d) bytes = d; }
        if (bytes.length <= 20e6) dados[e.nome.replace(/\\/g, '/')] = bytes;
      }
      r.push(xs.length ? xs.slice(0, 200).map((e) => '- ' + e.nome + ' (' + Math.max(1, Math.round(e.ulen / 1024)) + ' KB)').join('\n') + (xs.length > 200 ? '\n- …' : '') : '- nenhum');
      r.push('', '## Tudo que está dentro, por tipo');
      const cont = {}; ents.forEach((e) => { cont[e.tipo] = (cont[e.tipo] || 0) + 1; });
      r.push(Object.entries(cont).map(([t, n]) => '- ' + (tipos[t] || t) + ': ' + n).join('\n'));
    } else {
      let tipo = 'não reconheci';
      if (temTexto('Nuitka') || temTexto('__compiled__')) tipo = '**Nuitka** — transforma o Python em programa C de verdade (mais rápido, e o código não volta a ser .py)';
      else if (temTexto('Electron') && (temTexto('app.asar') || temTexto('electron.asar'))) tipo = '**Electron** (uma tela HTML numa janela, com Node por dentro) — se tiver a pasta resources/app.asar ao lado, a tela fica lá';
      else if (temTexto('Nullsoft') || temTexto('NSIS')) tipo = '**instalador NSIS** (ele instala outro programa; o programa de verdade está dentro, comprimido)';
      else if (temTexto('Inno Setup')) tipo = '**instalador Inno Setup**';
      else if (temTexto('mscoree.dll') || temTexto('_CorExeMain')) tipo = '**.NET (C#)**';
      else if (temTexto('Go build ID') || temTexto('runtime.gopanic')) tipo = '**Go**';
      else if (temTexto('rust_panic') || temTexto('/rustc/')) tipo = '**Rust**';
      else if (temTexto('python3') || temTexto('Py_Initialize')) tipo = '**Python embrulhado** (outro empacotador, não o PyInstaller)';
      r.push('- **Feito com:** ' + tipo, '- **Tamanho:** ' + Math.round(total / 1048576) + ' MB');
    }
    if (ultimo) anterior = ultimo;
    ultimo = { nome: arquivo.name.replace(/\.exe$/i, ''), zip: null, rel: r.join('\n') + '\n', web: {}, raizWeb: '', dados,
      cmp: { nome: arquivo.name, tipo: '.exe', nArq: Object.keys(dados).length, importa: [], libs: [], rotas: [], hosts: [], limites: [], frases: [], prompts: [], originais: {} } };
    return ultimo;
  }

  function tela() {
    const el = $('#panel-raiox'); if (!el) return;
    if (!el.dataset.ok) {
      el.dataset.ok = '1';
      el.innerHTML = '<div class="card"><h2>🔍 Raio-X de APK e .EXE</h2><p class="muted">Escolha um <b>.apk</b>, um <b>.exe</b> do Windows (ex.: o feito em Python) ou o .zip de um projeto. Ele <b>não instala nada</b>: só olha por dentro e te diz em português que tipo de app é, se ele usa um site da internet, que endereços chama, <b>como importa arquivo</b> e se ficou alguma chave dentro.</p><p class="muted">🆕 Também serve para <b>build</b> (a pasta dist em .zip): ele tira as 📖 <b>frases</b> da tela, as 🧠 <b>instruções da IA</b>, 🗺 <b>recupera o código original</b> se tiver arquivo .map, 🧹 <b>desembola</b> o código espremido e ⚖️ <b>compara duas versões</b> (abra a que funciona, depois a que não funciona).</p>' +
        '<label class="btn p">📂 Escolher o APK, .exe ou .zip<input type="file" id="rx-f" accept=".apk,.aab,.zip,.exe,application/vnd.android.package-archive,application/zip,application/x-msdownload,application/octet-stream" hidden></label>' +
        '<p class="muted" style="margin-top:6px">Dica: se o celular não deixar escolher .apk, faça uma cópia e troque o final para <b>.zip</b>.</p></div><div id="rx-saida"></div>';
      $('#rx-f').onchange = async (e) => {
        const f = e.target.files[0]; e.target.value = ''; if (!f) return;
        const s = $('#rx-saida'); s.innerHTML = '<div class="card"><p class="muted">⏳ Abrindo ' + esc(f.name) + '…</p></div>';
        try { const u = await examinar(f); mostrar(u); } catch (er) { s.innerHTML = '<div class="card"><p style="color:#ef4444">⚠ Não consegui abrir: ' + esc(er.message) + '</p></div>'; }
      };
      el.addEventListener('click', async (e) => {
        const b = e.target.closest('[data-rx]'); if (!b || !ultimo) return;
        const a = b.dataset.rx;
        if (a === 'md') LB.baixar('raio-x-' + ultimo.nome + '.md', ultimo.rel, 'text/markdown');
        if (a === 'copiar') LB.copiar(ultimo.rel);
        if (a === 'zip') { b.disabled = true; b.textContent = '⏳ montando…'; let fonte = ultimo.zip; if (!fonte) { fonte = new JSZip(); Object.entries(ultimo.dados || {}).forEach(([k, v]) => fonte.file(k, v)); fonte.file('RAIO-X.md', ultimo.rel); } const blob = await fonte.generateAsync({ type: 'blob', compression: 'DEFLATE' }); LB.baixar(ultimo.nome + '-desmontado.zip', blob, 'application/zip'); b.disabled = false; b.textContent = '⬇ Baixar desmontado (.zip)'; }
        if (a === 'projeto') {
          const arquivos = {}; Object.entries(ultimo.web).forEach(([k, t]) => { if (/\.map$/.test(k)) return; arquivos[ultimo.raizWeb && k.startsWith(ultimo.raizWeb) ? k.slice(ultimo.raizWeb.length) : k] = { t }; });
          Object.entries(ultimo.dados || {}).forEach(([k, v]) => { if (/\.(html?|js|css|json|txt|md|py|xml|ya?ml|ini|csv|svg)$/i.test(k)) arquivos[k] = { t: new TextDecoder().decode(v) }; });
          arquivos['RAIO-X.md'] = { t: ultimo.rel };
          const p = { id: LB.novoId(), nome: '📱 ' + ultimo.nome, criado: Date.now(), origem: 'raio-x', arquivos };
          await LB.banco.salvar(p); await LB.carregarProjetos(); LB.escolher(p.id); LB.aviso('✅ Abri a parte web como projeto "' + p.nome + '". Veja no 🔗 Mapa ou na 🧪 Prévia.', 'ok');
        }
        if (a === 'orig' || a === 'origproj') {
          const o = ultimo.mais && ultimo.mais.orig.arquivos; const com = Object.entries(o || {}).filter(([, v]) => v != null);
          if (!com.length) { LB.aviso('Este build não trouxe o código original (.map com texto).', 'erro'); return; }
          if (a === 'orig') { const z = new JSZip(); com.forEach(([k, v]) => z.file(k, v)); z.file('LEIA-ME.md', '# 🗺 Código original recuperado do build "' + ultimo.nome + '"\n\nTirado dos arquivos .map (o "mapa de volta" que o build deixou). São os arquivos do jeito que foram escritos.\nNão inclui as bibliotecas (node_modules) nem o package.json: para rodar de novo, junte com o package.json do projeto.\n'); LB.baixar(ultimo.nome + '-codigo-original.zip', await z.generateAsync({ type: 'blob', compression: 'DEFLATE' }), 'application/zip'); }
          else { const arquivos = {}; com.forEach(([k, v]) => { arquivos[k] = { t: v }; }); arquivos['RAIO-X.md'] = { t: ultimo.rel }; const p = { id: LB.novoId(), nome: '🗺 ' + ultimo.nome + ' (original)', criado: Date.now(), origem: 'raio-x-map', arquivos }; await LB.banco.salvar(p); await LB.carregarProjetos(); LB.escolher(p.id); LB.aviso('✅ Código original aberto como projeto "' + p.nome + '".', 'ok'); }
        }
        if (a === 'desembolar') {
          b.disabled = true; const velho = b.textContent; b.textContent = '⏳ desembolando…';
          try {
            const z = new JSZip(); let n = 0;
            for (const [k, t] of Object.entries(ultimo.web)) { if (!/\.(m?js|cjs)$/i.test(k)) continue; await new Promise((ok) => setTimeout(ok, 0)); z.file(k.replace(ultimo.raizWeb, ''), LB.raioxMais.desembolar(t)); n++; }
            if (!n) { LB.aviso('Não achei arquivos .js para desembolar.', 'erro'); }
            else { z.file('LEIA-ME.md', '# 🧹 Código desembolado — ' + ultimo.nome + '\n\nO mesmo código do build, só que quebrado em linhas e com recuo, para LER.\nNão é para rodar no lugar do original. Os nomes curtos (a, b, e…) continuam curtos: o build trocou os nomes.\n'); LB.baixar(ultimo.nome + '-desembolado.zip', await z.generateAsync({ type: 'blob', compression: 'DEFLATE' }), 'application/zip'); LB.aviso('🧹 ' + n + ' arquivo(s) desembolado(s).', 'ok'); }
          } finally { b.disabled = false; b.textContent = velho; }
        }
        if (a === 'frases') {
          const m = ultimo.mais || { frases: [], prompts: [] };
          const md = '# 📖 Frases e instruções — ' + ultimo.nome + '\n\n## 🧠 Instruções para a IA (' + m.prompts.length + ')\n\n' + m.prompts.map((p, i) => '### Instrução ' + (i + 1) + '\n\n```\n' + p + '\n```\n').join('\n') + '\n## 📖 Frases em português (' + m.frases.length + ')\n\n' + m.frases.map((f) => '- ' + f).join('\n') + '\n';
          LB.baixar('frases-' + ultimo.nome + '.md', md, 'text/markdown');
        }
        if (a === 'comparar') {
          if (!anterior) { LB.aviso('Abra primeiro outra versão: ele compara com a anterior.', 'erro'); return; }
          const md = LB.raioxMais.comparar(anterior.cmp, ultimo.cmp); ultimo.comparacao = md;
          $('#rx-cmp').innerHTML = '<div class="linha" style="flex-wrap:wrap;margin-top:8px"><button class="btn" data-rx="cmpbaixar">⬇ Comparação (.md)</button><button class="btn" data-rx="cmpcopiar">📋 Copiar</button><button class="btn" data-rx="cmpia">🤖 Perguntar à IA</button></div><pre style="white-space:pre-wrap;max-height:70vh;overflow:auto;margin-top:8px">' + esc(md) + '</pre>';
        }
        if (a === 'cmpbaixar' && ultimo.comparacao) LB.baixar('comparacao-' + ultimo.nome + '.md', ultimo.comparacao, 'text/markdown');
        if (a === 'cmpcopiar' && ultimo.comparacao) LB.copiar(ultimo.comparacao);
        if (a === 'cmpia' && ultimo.comparacao) { LB.irAba('ia'); setTimeout(() => LB.ia.colar('⚖️ Comparação de duas versões', ultimo.comparacao + '\n\nUma destas versões funciona e a outra não. Me explique em português simples qual é a diferença que provavelmente causa o defeito (principalmente na importação de arquivos) e como levar o conserto para a que não funciona. Não invente: se não der para saber, diga. Termine com 📋 Situação.'), 80); }
        if (a === 'ia') { LB.irAba('ia'); setTimeout(() => LB.ia.colar('🔍 Raio-X de um APK', ultimo.rel + '\n\nMe explique em português simples o que este app faz, como ele importa arquivos e o que dá para aproveitar no meu jurídico. Termine com 📋 Situação.'), 80); }
      });
    }
  }
  function mostrar(u) {
    const s = $('#rx-saida');
    s.innerHTML = '<div class="card"><div class="linha" style="flex-wrap:wrap"><button class="btn p" data-rx="md">⬇ Relatório (.md)</button><button class="btn" data-rx="copiar">📋 Copiar relatório</button><button class="btn" data-rx="zip">⬇ Baixar desmontado (.zip)</button><button class="btn" data-rx="projeto">➕ Abrir a parte web como projeto</button><button class="btn" data-rx="ia">🤖 Perguntar à IA</button></div>' +
      '<div class="linha" style="flex-wrap:wrap;margin-top:6px">' +
      (u.mais && Object.values(u.mais.orig.arquivos).some((v) => v != null) ? '<button class="btn p" data-rx="orig">🗺 Recuperar o código original (.zip)</button><button class="btn" data-rx="origproj">➕ Abrir o original como projeto</button>' : '') +
      (u.mais && u.mais.espremidos.length ? '<button class="btn" data-rx="desembolar">🧹 Desembolar (.zip)</button>' : '') +
      (u.mais ? '<button class="btn" data-rx="frases">📖 Frases e instruções (.md)</button>' : '') +
      (anterior ? '<button class="btn" data-rx="comparar">⚖️ Comparar com "' + esc(anterior.cmp.nome) + '"</button>' : '') + '</div>' +
      '<p class="muted" style="margin-top:6px">⚖️ Para comparar: abra a versão que <b>funciona</b>, depois a que <b>não funciona</b>, e toque em ⚖️.</p><div id="rx-cmp"></div>' +
      '<pre style="white-space:pre-wrap;max-height:70vh;overflow:auto;margin-top:8px">' + esc(u.rel) + '</pre></div>';
  }
  window.addEventListener('lab-aba', (e) => { if (e.detail === 'raiox') tela(); });
  LB.raiox = { examinar, tela, _ultimo: () => ultimo };
})(window.LB);
