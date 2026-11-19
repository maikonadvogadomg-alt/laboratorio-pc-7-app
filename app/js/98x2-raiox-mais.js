/* Laboratório — 98x2-raiox-mais.js: 🔍 RAIO-X, parte 2 (17/11) — tirar informação de BUILD e de APK
   O build (a pasta dist, ou a tela dentro do APK) vem "embolado": tudo espremido numa linha só,
   às vezes num arquivo, às vezes em 50. Mesmo assim dá para tirar muita coisa:
   📖 Frases em português — os textos da tela, as mensagens de erro e de aviso (ficam legíveis no build)
   🧠 Instruções para a IA — os textos grandes que o app manda para a IA (o "motor"), se estiverem lá
   🗺 Mapa de volta (.map) — se o build trouxe arquivos .map, eles guardam o CÓDIGO ORIGINAL: ele recupera
   🧹 Desembolar — quebra o código espremido em linhas, com recuo (só para LER; não é para rodar)
   ⚖️ Comparar — a versão que funciona × a que não funciona: o que uma tem e a outra não
   Nada aqui muda os seus arquivos: tudo é cópia. */
(function (LB) {
  'use strict';

  // ---------- os textos que estão dentro do código (com o acorn: não confunde aspas, regex e `…${}…`) ----------
  function literais(t, html) {
    if (html) {
      const out = [];
      (t.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi) || []).forEach((sc) => out.push(...literais(sc.replace(/^<script[^>]*>|<\/script>$/gi, ''))));
      (t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').match(/>([^<>]{6,400})</g) || []).forEach((x) => out.push(x.slice(1, -1).replace(/\s+/g, ' ').trim()));
      return out;
    }
    if (window.acorn && t.length < 30e6) {
      for (const tipo of ['module', 'script']) {
        try {
          const out = []; let tpl = null;
          for (const k of acorn.tokenizer(t, { ecmaVersion: 'latest', sourceType: tipo, allowHashBang: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowImportExportEverywhere: true })) {
            const l = k.type.label;
            if (l === 'string') out.push(String(k.value));
            else if (l === '`') { if (tpl === null) tpl = ''; else { out.push(tpl); tpl = null; } }
            else if (l === 'template' || l === 'invalidTemplate') { if (tpl !== null) tpl += (k.value == null ? '' : k.value); }
            else if (l === '${' && tpl !== null) tpl += '${…}';
          }
          return out;
        } catch (e) { /* tenta o outro jeito */ }
      }
    }
    const out = [], re = /(["'])((?:\\.|(?!\1)[^\\\n])*)\1|`((?:\\.|[^`\\])*)`/g; let m;
    while ((m = re.exec(t))) out.push((m[2] != null ? m[2] : m[3]).replace(/\\n/g, '\n').replace(/\\(["'`\\])/g, '$1'));
    return out;
  }
  // ---------- 📖 frases em português ----------
  const PT = /[áéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ]|\b(de|para|não|você|seu|sua|com|uma|um|do|da|dos|das|que|por|ao|no|na|em|ou|se|é|está|arquivo|erro|salvar|processo|enviar|abrir|clique|toque|aguarde|carregando)\b/i;
  const PARECE_CODIGO = /^[\w.\-/:#@[\]()=,]+$|[{};]\s*$|^\s*(function|return|var|let|const)\b|<\/?[a-z][^>]*>|https?:\/\//i;
  // "flex items-center gap-2 text-sm" (classes de estilo) não é frase: muitas palavras com - ou :
  const pareceClasse = (s) => { const p = s.split(/\s+/); return p.length >= 2 && p.filter((w) => /[-:\/[\]]/.test(w)).length >= p.length / 2; };
  function frasesDe(lits) {
    const vistas = new Set(), frases = [];
    for (let s of lits) {
      if (frases.length >= 3000) break;
      s = String(s).replace(/\s+/g, ' ').trim();
      if (s.length < 6 || s.length > 400 || !/\s/.test(s) || !PT.test(s) || PARECE_CODIGO.test(s) || pareceClasse(s)) continue;
      if (vistas.has(s)) continue; vistas.add(s); frases.push(s);
    }
    return frases;
  }
  // ---------- 🧠 instruções para a IA (os textos grandes) ----------
  const PROMPT = /(você é|voce e|you are|regras|instru[çc][õo]es|assistente|jur[ií]dic|peti[çc][ãa]o|responda|nunca invente|sempre)/gi;
  function promptsDe(lits) {
    const out = [], vistos = new Set();
    for (const s of lits) {
      if (out.length >= 40) break;
      if (!s || s.length < 200) continue;
      if ((s.match(PROMPT) || []).length < 2 || !PT.test(s) || /^\s*</.test(s)) continue;
      const chave = s.slice(0, 120); if (vistos.has(chave)) continue; vistos.add(chave);
      out.push(s);
    }
    return out;
  }
  // ---------- 🗺 mapa de volta (.map → código original) ----------
  function limparCaminho(p) {
    return String(p).replace(/^webpack:\/\/[^/]*\//, '').replace(/^[a-z]+:\/\//i, '').replace(/^(\.\.\/|\.\/|\/)+/, '').replace(/\?.*$/, '');
  }
  function originaisDe(web) {
    const arquivos = {}; let deBibliotecas = 0, semConteudo = 0, mapas = 0;
    for (const [nome, t] of Object.entries(web)) {
      if (!/\.map$/.test(nome)) continue;
      let j; try { j = JSON.parse(t); } catch (e) { continue; }
      if (!j || !Array.isArray(j.sources)) continue;
      mapas++;
      j.sources.forEach((src, i) => {
        const c = limparCaminho(src);
        if (/(^|\/)node_modules\/|^vite\/|^\(webpack\)|^\x00/.test(c) || /^\s*$/.test(c)) { deBibliotecas++; return; }
        const conteudo = j.sourcesContent && j.sourcesContent[i];
        if (conteudo == null) { semConteudo++; if (!arquivos[c]) arquivos[c] = null; return; }
        arquivos[c] = conteudo;
      });
    }
    return { arquivos, deBibliotecas, semConteudo, mapas };
  }
  // ---------- 🧹 desembolar (usa o acorn que já vem no Laboratório para não errar em texto/regex) ----------
  function desembolar(src) {
    if (!window.acorn || !src || src.length > 30e6) return src;
    let toks;
    try { toks = [...acorn.tokenizer(src, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowImportExportEverywhere: true })]; }
    catch (e) { try { toks = [...acorn.tokenizer(src, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true, allowReturnOutsideFunction: true })]; } catch (e2) { return src.replace(/;(?=\S)/g, ';\n'); } }
    const out = [], pilha = []; let nivel = 0, ant = null;
    const ind = () => '\n' + '  '.repeat(Math.max(0, Math.min(nivel, 30)));
    const quebrou = () => /\n[ ]*$/.test(out[out.length - 1] || '');
    const nl = () => { if (quebrou()) out[out.length - 1] = ind(); else out.push(ind()); };
    const SEM_QUEBRA = /^(\)|,|;|\.|\]|else|catch|finally|while|\?\.)$/;
    for (let i = 0; i < toks.length; i++) {
      const k = toks[i], lbl = k.type.label, txt = src.slice(k.start, k.end);
      let fechouBloco = false;
      if (lbl === '}') { const tipo = pilha.pop(); if (tipo === 'blk' && !pilha.includes('tpl')) { nivel = Math.max(0, nivel - 1); nl(); fechouBloco = true; } }
      if (ant && !fechouBloco && !quebrou()) {
        const vao = src.slice(ant.end, k.start);
        if (/\n/.test(vao) && !pilha.includes('tpl')) nl(); else if (vao.length) out.push(' ');
      }
      out.push(txt);
      const emTpl = pilha.includes('tpl');
      if (lbl === '${') pilha.push('tpl');
      else if (lbl === '(' || lbl === '[') pilha.push('(');
      else if (lbl === ')' || lbl === ']') { if (pilha[pilha.length - 1] === '(') pilha.pop(); }
      else if (lbl === '{') { pilha.push('blk'); if (!emTpl) { nivel++; nl(); } }
      else if (lbl === ';' && !emTpl && pilha[pilha.length - 1] !== '(') nl();
      else if (fechouBloco) { const p = toks[i + 1]; if (!p || !SEM_QUEBRA.test(p.type.label)) nl(); }
      ant = k;
    }
    return out.join('').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  }

  // ---------- análise que entra no relatório ----------
  function analisar(web) {
    const lits = [];
    for (const [n, t] of Object.entries(web)) {
      if (/\.map$/.test(n)) continue;
      if (/\.(m?js|cjs)$/i.test(n)) lits.push(...literais(t));
      else if (/\.html?$/i.test(n)) lits.push(...literais(t, true));
      else if (/\.json$/i.test(n) && t.length < 5e6) { try { (function andar(v) { if (typeof v === 'string') lits.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(andar); })(JSON.parse(t)); } catch (e) {} }
    }
    const frases = frasesDe(lits);
    const prompts = promptsDe(lits);
    const orig = originaisDe(web);
    const nOrig = Object.keys(orig.arquivos).length, nComTexto = Object.values(orig.arquivos).filter((v) => v != null).length;
    const espremidos = Object.entries(web).filter(([n, t]) => /\.m?js$/i.test(n) && t.length > 5000 && (t.match(/\n/g) || []).length < t.length / 2000).map(([n]) => n);
    const l = [];
    l.push('', '## 🗺 Mapa de volta (código original)');
    if (!orig.mapas) l.push('- Não veio nenhum arquivo `.map` neste build. Então o código original não está aqui — mas dá para ler as frases, as instruções da IA e desembolar o código (abaixo).');
    else if (nComTexto) l.push('- ✅ **Achei ' + orig.mapas + ' mapa(s) com ' + nComTexto + ' arquivo(s) do CÓDIGO ORIGINAL** (do jeito que foi escrito, com nomes e comentários). Toque em **🗺 Recuperar o código original**.' + (orig.deBibliotecas ? ' (' + orig.deBibliotecas + ' arquivo(s) de bibliotecas foram deixados de fora.)' : ''));
    else l.push('- Achei ' + orig.mapas + ' mapa(s), mas sem o texto dentro: só os NOMES dos ' + nOrig + ' arquivos originais (já ajuda a saber como o projeto era dividido).');
    if (nOrig) l.push('', 'Arquivos originais' + (nComTexto ? '' : ' (só os nomes)') + ':', Object.keys(orig.arquivos).sort().slice(0, 150).map((n) => '- ' + n).join('\n') + (nOrig > 150 ? '\n- …' : ''));
    l.push('', '## 🧠 Instruções para a IA achadas (' + prompts.length + ')');
    if (prompts.length) prompts.slice(0, 12).forEach((p, i) => { l.push('', '### Instrução ' + (i + 1) + ' (' + p.length + ' letras)', '```', p.length > 3000 ? p.slice(0, 3000) + '\n… (continua — veja o .zip "📖 frases e instruções")' : p, '```'); });
    else l.push('- Nenhuma. (Se o app manda as instruções pelo SERVIDOR, elas ficam no servidor, não na tela.)');
    l.push('', '## 📖 Frases em português achadas (' + frases.length + ')', '_Os textos da tela, avisos e erros. Servem para achar onde cada coisa acontece e comparar versões._');
    l.push(frases.length ? frases.slice(0, 80).map((f) => '- ' + (f.length > 160 ? f.slice(0, 160) + '…' : f)).join('\n') + (frases.length > 80 ? '\n- … (todas no .zip "📖 frases e instruções")' : '') : '- nenhuma');
    if (espremidos.length) l.push('', '## 🧹 Código espremido', '- ' + espremidos.length + ' arquivo(s) estão numa linha só (build). Toque em **🧹 Desembolar** para baixar todos quebrados em linhas, mais fáceis de ler.');
    return { linhas: l, frases, prompts, orig, espremidos };
  }

  // ---------- ⚖️ comparar duas versões ----------
  const conjunto = (a) => new Set(a || []);
  function dif(a, b) { const A = conjunto(a), B = conjunto(b); return { soA: [...A].filter((x) => !B.has(x)), soB: [...B].filter((x) => !A.has(x)), ambos: [...A].filter((x) => B.has(x)) }; }
  function comparar(A, B) {
    const r = ['# ⚖️ Comparando duas versões', '', '- **A:** ' + A.nome, '- **B:** ' + B.nome, ''];
    const bloco = (titulo, a, b, max = 60) => {
      const d = dif(a, b);
      r.push('## ' + titulo);
      if (!d.soA.length && !d.soB.length) { r.push('- iguais nas duas ✅', ''); return; }
      if (d.soA.length) r.push('**Só no A (' + d.soA.length + '):**', d.soA.slice(0, max).map((x) => '- ' + (x.length > 160 ? x.slice(0, 160) + '…' : x)).join('\n') + (d.soA.length > max ? '\n- …' : ''));
      if (d.soB.length) r.push('**Só no B (' + d.soB.length + '):**', d.soB.slice(0, max).map((x) => '- ' + (x.length > 160 ? x.slice(0, 160) + '…' : x)).join('\n') + (d.soB.length > max ? '\n- …' : ''));
      r.push('');
    };
    r.push('## Resumo', '| | A | B |', '|---|---|---|',
      '| Tipo | ' + A.tipo + ' | ' + B.tipo + ' |',
      '| Arquivos | ' + A.nArq + ' | ' + B.nArq + ' |',
      '| Frases em português | ' + A.frases.length + ' | ' + B.frases.length + ' |',
      '| Instruções para a IA | ' + A.prompts.length + ' | ' + B.prompts.length + ' |',
      '| Código original (.map) | ' + Object.keys(A.originais).length + ' | ' + Object.keys(B.originais).length + ' |', '');
    bloco('📥 Como importa arquivo (o mais importante para o seu problema de importar)', A.importa, B.importa);
    bloco('🧰 Bibliotecas que usa', A.libs, B.libs);
    bloco('🛣 Rotas /api', A.rotas, B.rotas);
    bloco('🌐 Endereços de internet', A.hosts, B.hosts);
    bloco('📏 Limites de tamanho', A.limites, B.limites);
    const oa = A.originais, ob = B.originais;
    if (Object.keys(oa).length && Object.keys(ob).length) {
      const d = dif(Object.keys(oa), Object.keys(ob));
      const mudou = d.ambos.filter((k) => oa[k] != null && ob[k] != null && oa[k] !== ob[k]);
      r.push('## 🗺 Código original: arquivos diferentes', mudou.length ? mudou.map((k) => '- ✏️ ' + k + ' (A: ' + oa[k].length + ' letras · B: ' + ob[k].length + ')').join('\n') : '- nenhum arquivo em comum mudou');
      if (d.soA.length) r.push('', '**Arquivos só no A:**', d.soA.slice(0, 80).map((x) => '- ' + x).join('\n'));
      if (d.soB.length) r.push('', '**Arquivos só no B:**', d.soB.slice(0, 80).map((x) => '- ' + x).join('\n'));
      r.push('');
    }
    bloco('📖 Frases da tela e avisos (mostra textos que só uma versão tem)', A.frases, B.frases, 50);
    r.push('## 🧭 Como ler isto', '- Se a versão que **funciona** "lê o PDF no aparelho" e a outra "manda para o servidor", a diferença da importação está aí.', '- Frases de erro que só uma tem mostram onde ela falha.', '- Para consertar: mande este relatório para a IA (🤖) junto com o código original da versão que NÃO funciona.');
    return r.join('\n') + '\n';
  }

  LB.raioxMais = { analisar, desembolar, comparar, originaisDe, frasesDe, promptsDe, literais };
})(window.LB);
