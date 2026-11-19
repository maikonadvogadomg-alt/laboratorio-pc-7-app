# 📋 Plano do projeto: laboratorio-pc (7)

_Gerado em 18/11/2026, 23:29:40 — sem IA, lendo os arquivos._

## 📊 Visão geral
| Item | Valor |
|---|---|
| Arquivos | 242 |
| Linhas | 44.409 |
| Telas/páginas | 20 |
| Rotas do backend | 0 |
| Chamadas do app | 3 |
| Tabelas do banco | 0 |
| Variáveis de ambiente | 9 |

**Linguagens:** JavaScript (168), HTML (20), Markdown (19), Outros (10), Imagem (7), CSS (6), Python (6), JSON (5), YAML (1)

## 💡 O que fazer (em ordem)
1. 🧹 Tirar a Replit de 32 arquivo(s) (🏗️ Preparar → Fazer tudo)
2. 🔐 Criar um .env.example com: BASE_PATH, DADOS_EM, GITHUB_STEP_SUMMARY, LOCALAPPDATA, PONTE_BASE, PONTE_CODIGO, PONTE_PORTA, PORT, TESTE_SAIR (os valores você coloca no servidor, nunca no código)

## 🚀 Por onde começa
- `app/ferramentas/cacabug/index.html`
- `app/ferramentas/laboratorio2/index.html`
- `app/ferramentas/meu-chat/index.html`
- `app/index.html`

## ⌨️ Comandos (package.json)
| Pasta | Comando | O que roda |
|---|---|---|
| . | `npm run programa` | `electron .` |
| . | `npm run exe` | `electron-builder --win nsis portable --x64 --publish never` |

## 📱 Telas e páginas
| Endereço | Arquivo |
|---|---|
| `app/ferramentas/ai-code-studio.html` | app/ferramentas/ai-code-studio.html |
| `app/ferramentas/arrumador.html` | app/ferramentas/arrumador.html |
| `app/ferramentas/banco-neon.html` | app/ferramentas/banco-neon.html |
| `app/ferramentas/cacabug/index.html` | app/ferramentas/cacabug/index.html |
| `app/ferramentas/colador.html` | app/ferramentas/colador.html |
| `app/ferramentas/faxina.html` | app/ferramentas/faxina.html |
| `app/ferramentas/iara-suite.html` | app/ferramentas/iara-suite.html |
| `app/ferramentas/juntador.html` | app/ferramentas/juntador.html |
| `app/ferramentas/laboratorio2/ferramentas/colador.html` | app/ferramentas/laboratorio2/ferramentas/colador.html |
| `app/ferramentas/laboratorio2/ferramentas/meu-chat/index.html` | app/ferramentas/laboratorio2/ferramentas/meu-chat/index.html |
| `app/ferramentas/laboratorio2/index.html` | app/ferramentas/laboratorio2/index.html |
| `app/ferramentas/meu-chat/index.html` | app/ferramentas/meu-chat/index.html |
| `app/ferramentas/montador.html` | app/ferramentas/montador.html |
| `app/ferramentas/numerador.html` | app/ferramentas/numerador.html |
| `app/ferramentas/picotador.html` | app/ferramentas/picotador.html |
| `app/ferramentas/preparador.html` | app/ferramentas/preparador.html |
| `app/ferramentas/projeto-lab.html` | app/ferramentas/projeto-lab.html |
| `app/ferramentas/replicador.html` | app/ferramentas/replicador.html |
| `app/index.html` | app/index.html |
| `electron/navegador.html` | electron/navegador.html |

## 🖥️ Rotas do backend
_Nenhum encontrado._

## 📡 O que o app pede ao servidor
| Método | Endereço | Onde |
|---|---|---|
| POST | `/models/${encodeURIComponent(c.modelo)}:generateContent` | app/ferramentas/cacabug/ferramentas/cirurgiao.js |
| POST | `/messages` | app/ferramentas/cacabug/ferramentas/cirurgiao.js |
| POST | `/chat/completions` | app/ferramentas/cacabug/ferramentas/cirurgiao.js |

## 🔌 O que falta no backend
✅ Tudo que o app chama tem rota no projeto (ou o app não usa servidor).

## 🗄️ Banco de dados
_Nenhuma tabela encontrada._

## 🔐 Variáveis de ambiente (configurar no servidor)
- `BASE_PATH`
- `DADOS_EM`
- `GITHUB_STEP_SUMMARY`
- `LOCALAPPDATA`
- `PONTE_BASE`
- `PONTE_CODIGO`
- `PONTE_PORTA`
- `PORT`
- `TESTE_SAIR`

_Só os nomes. Os valores (chaves, senhas) nunca vão no código nem no GitHub._

## 🤖 IA usada
- api.openai.com
- api.groq.com
- openrouter.ai
- generativelanguage.googleapis.com
- api.anthropic.com
- console.groq.com
- platform.openai.com
- console.anthropic.com

## 🌐 Serviços de fora que ele acessa
- abcdxyz.supabase.co
- aistudio.google.com
- api-dashboard.search.brave.com
- api.anthropic.com
- api.deepseek.com
- api.github.com
- api.groq.com
- api.mistral.ai
- api.npmjs.org
- api.openai.com
- api.perplexity.ai
- api.search.brave.com
- api.tavily.com
- api.x.ai
- app.tavily.com
- cdn.jsdelivr.net
- cdn.tailwindcss.com
- cdnjs.cloudflare.com
- console.anthropic.com
- console.groq.com
- data.jsdelivr.com
- esm.sh
- expo.dev
- fonts.googleapis.com
- fonts.gstatic.com
- generativelanguage.googleapis.com
- github.com
- google.serper.dev
- meuchat.local
- nodejs.org
- ollama.com
- openapi.monica.im
- openrouter.ai
- platform.deepseek.com
- platform.openai.com
- pypi.org
- r.jina.ai
- raw.github.com
- raw.githubusercontent.com
- registry.npmjs.org
- serper.dev
- stuartk.com
- stuk.github.io
- u.expo.dev
- unpkg.com
- www.npmjs.com
- www.perplexity.ai
- xxxx.supabase.co

## 📦 Peças principais (dependências)
`msedge-tts` · `ws`

## 🧹 Arquivos com coisa da Replit
- app/ferramentas/cacabug/ferramentas/analisador-universal.js
- app/ferramentas/cacabug/ferramentas/cirurgiao.js
- app/ferramentas/cacabug/ferramentas/montar.py
- app/ferramentas/cacabug/ferramentas/projeto-lab.js
- app/ferramentas/cacabug/ferramentas/raiox.js
- app/ferramentas/cacabug/js/30-projeto.js
- app/ferramentas/cacabug/js/46-limpo.js
- app/ferramentas/cacabug/js/60-comparar.js
- app/ferramentas/cacabug/js/80-terminal.js
- app/ferramentas/cacabug/js/99-app.js
- app/ferramentas/cacabug/js/lib/expo-core.js
- app/ferramentas/cacabug/js/lib/plano-core.js
- app/ferramentas/laboratorio2/ferramentas/meu-chat/js/14-entrada.js
- app/ferramentas/laboratorio2/ferramentas/meu-chat/js/33-contextos.js
- app/ferramentas/laboratorio2/ferramentas/meu-chat/js/lib/guia-maikon.js
- app/ferramentas/laboratorio2/ferramentas/meu-chat/js/lib/guia-versoes.js
- app/ferramentas/laboratorio2/ferramentas/meu-chat/js/lib/reconhecer.js
- app/ferramentas/laboratorio2/js/15a-tar.js
- app/ferramentas/laboratorio2/js/16-lab-ferramentas.js
- app/ferramentas/laboratorio2/js/19-embutido.js
- app/ferramentas/meu-chat/js/14-entrada.js
- app/ferramentas/meu-chat/js/33-contextos.js
- app/ferramentas/meu-chat/js/lib/guia-maikon.js
- app/ferramentas/meu-chat/js/lib/guia-versoes.js
- app/ferramentas/meu-chat/js/lib/reconhecer.js
- app/js/60-ferramentas.js
- app/js/95-fatiador.js
- app/js/96-recuperar.js
- app/js/98x-raiox.js
- app/kits/kit-replit.cjs
- app/kits/organizar.py
- app/kits/servir.py

## 🔁 Roteiro para recriar fora da Replit
1. Importar o projeto no Mini SK e tocar em 🏗️ Preparar → ✅ Fazer tudo (tira a Replit, cria os arquivos que faltam).
2. Não tem backend: o site sozinho basta (Netlify ou GitHub Pages).
3. Variáveis: cadastrar 9 variável(is) no servidor (lista acima).
4. Testar a prévia; se der erro, 🤖 Mandar os erros para a IA.
5. App: 📲 Instalável (PWA), 📦 APK ou 🖥️ Desktop (.exe) pelo 🏗️ Preparar.

## 🌳 Árvore de arquivos
```
├─ 📁 .github/
│  └─ 📁 workflows/
│     └─ programa-exe.yml
├─ 📁 app/
│  ├─ 📁 css/
│  │  ├─ antigo.css
│  │  ├─ app.css
│  │  └─ extra.css
│  ├─ 📁 ferramentas/
│  │  ├─ 📁 cacabug/
│  │  │  ├─ 📁 css/
│  │  │  │  └─ app.css
│  │  │  ├─ 📁 ferramentas/
│  │  │  │  ├─ ai-code-studio.js
│  │  │  │  ├─ analisador-universal.js
│  │  │  │  ├─ cirurgiao.js
│  │  │  │  ├─ desembrulhar.js
│  │  │  │  ├─ gerador-eas.js
│  │  │  │  ├─ montar.py
│  │  │  │  ├─ ordem.txt
│  │  │  │  ├─ projeto-lab.js
│  │  │  │  ├─ raiox.js
│  │  │  │  └─ triagem.js
│  │  │  ├─ 📁 icons/
│  │  │  │  ├─ icon-192.png
│  │  │  │  └─ icon-512.png
│  │  │  ├─ 📁 js/
│  │  │  │  ├─ 📁 lib/
│  │  │  │  │  ├─ expo-core.js
│  │  │  │  │  ├─ organizar-core.js
│  │  │  │  │  └─ plano-core.js
│  │  │  │  ├─ 00-core.js
│  │  │  │  ├─ 20-zip.js
│  │  │  │  ├─ 30-projeto.js
│  │  │  │  ├─ 40-ferramentas.js
│  │  │  │  ├─ 45-organizar.js
│  │  │  │  ├─ 46-limpo.js
│  │  │  │  ├─ 50-relatorios.js
│  │  │  │  ├─ 60-comparar.js
│  │  │  │  ├─ 70-ia.js
│  │  │  │  ├─ 80-terminal.js
│  │  │  │  ├─ 99-app.js
│  │  │  │  ├─ janela-pc.js
│  │  │  │  └─ tema.js
│  │  │  ├─ 📁 lib/
│  │  │  │  ├─ acorn.min.js
│  │  │  │  ├─ diff-LICENSE.txt
│  │  │  │  ├─ diff.min.js
│  │  │  │  ├─ jszip-LICENSE.md
│  │  │  │  └─ jszip.min.js
│  │  │  ├─ index.html
│  │  │  ├─ LEIA-ME.md
│  │  │  ├─ manifest.json
│  │  │  ├─ README.md
│  │  │  └─ sw.js
│  │  ├─ 📁 laboratorio2/
│  │  │  ├─ 📁 ferramentas/
│  │  │  │  ├─ 📁 meu-chat/
│  │  │  │  │  ├─ 📁 css/
│  │  │  │  │  │  └─ app.css
│  │  │  │  │  ├─ 📁 docs/
│  │  │  │  │  │  ├─ cacabug.md
│  │  │  │  │  │  ├─ laboratorio.md
│  │  │  │  │  │  ├─ meuchat.md
│  │  │  │  │  │  ├─ minisk.md
│  │  │  │  │  │  └─ sk-juridico-html.md
│  │  │  │  │  ├─ 📁 icons/
│  │  │  │  │  │  ├─ icon-192.png
│  │  │  │  │  │  └─ icon-512.png
│  │  │  │  │  ├─ 📁 js/
│  │  │  │  │  │  ├─ 📁 lib/ …
│  │  │  │  │  │  ├─ 00-base.js
│  │  │  │  │  │  ├─ 10-banco.js
│  │  │  │  │  │  ├─ 12-nuvem.js
│  │  │  │  │  │  ├─ 14-entrada.js
│  │  │  │  │  │  ├─ 20-provedores.js
│  │  │  │  │  │  ├─ 30-memoria.js
│  │  │  │  │  │  ├─ 33-contextos.js
│  │  │  │  │  │  ├─ 34-guia.js
│  │  │  │  │  │  ├─ 35-jeito.js
│  │  │  │  │  │  ├─ 36-gasto.js
│  │  │  │  │  │  ├─ 37-arquivos.js
│  │  │  │  │  │  ├─ 38-codigos.js
│  │  │  │  │  │  ├─ 39-qr.js
│  │  │  │  │  │  ├─ 40-voz.js
│  │  │  │  │  │  ├─ 41-pronto.js
│  │  │  │  │  │  ├─ 42-testar.js
│  │  │  │  │  │  ├─ 43-links.js
│  │  │  │  │  │  ├─ 44-docs.js
│  │  │  │  │  │  ├─ 45-mesa.js
│  │  │  │  │  │  ├─ 50-internet.js
│  │  │  │  │  │  ├─ 60-previa.js
│  │  │  │  │  │  ├─ 70-texto.js
│  │  │  │  │  │  ├─ 80-chat.js
│  │  │  │  │  │  ├─ 85-config.js
│  │  │  │  │  │  ├─ 87-cofre.js
│  │  │  │  │  │  ├─ 90-backup.js
│  │  │  │  │  │  ├─ 91-restaurar.js
│  │  │  │  │  │  ├─ 95-ponte-lab.js
│  │  │  │  │  │  ├─ 99-app.js
│  │  │  │  │  │  ├─ janela-pc.js
│  │  │  │  │  │  └─ nuvem-embutida.js
│  │  │  │  │  ├─ index.html
│  │  │  │  │  ├─ LEIA-ME.txt
│  │  │  │  │  ├─ manifest.json
│  │  │  │  │  ├─ README.md
│  │  │  │  │  └─ sw.js
│  │  │  │  └─ colador.html
│  │  │  ├─ 📁 js/
│  │  │  │  ├─ 00-casca.js
│  │  │  │  ├─ 02-importar.js
│  │  │  │  ├─ 03-dependencias.js
│  │  │  │  ├─ 04-analisar.js
│  │  │  │  ├─ 05-plano.js
│  │  │  │  ├─ 05a-markdown.js
│  │  │  │  ├─ 06-scripts.js
│  │  │  │  ├─ 06b-scripts-fim.js
│  │  │  │  ├─ 07-terminal.js
│  │  │  │  ├─ 07a-busca-npm.js
│  │  │  │  ├─ 08-exportar.js
│  │  │  │  ├─ 09-integracao.js
│  │  │  │  ├─ 10-celular.js
│  │  │  │  ├─ 11-lab-base.js
│  │  │  │  ├─ 12-lab-mapa.js
│  │  │  │  ├─ 13-lab-previa.js
│  │  │  │  ├─ 14-lab-pesquisa.js
│  │  │  │  ├─ 15-lab-comparar.js
│  │  │  │  ├─ 15a-tar.js
│  │  │  │  ├─ 16-lab-ferramentas.js
│  │  │  │  ├─ 17-lab-termux.js
│  │  │  │  ├─ 18-lab-desmontar.js
│  │  │  │  └─ 19-embutido.js
│  │  │  ├─ 📁 lib/
│  │  │  │  ├─ acorn.min.js
│  │  │  │  ├─ jszip.min.js
│  │  │  │  └─ pako.min.js
│  │  │  ├─ index.html
│  │  │  └─ LEIA-ME.md
│  │  ├─ 📁 meu-chat/
│  │  │  ├─ 📁 css/
│  │  │  │  └─ app.css
│  │  │  ├─ 📁 docs/
│  │  │  │  ├─ cacabug.md
│  │  │  │  ├─ laboratorio.md
│  │  │  │  ├─ meuchat.md
│  │  │  │  ├─ minisk.md
│  │  │  │  └─ sk-juridico-html.md
│  │  │  ├─ 📁 icons/
│  │  │  │  ├─ icon-192.png
│  │  │  │  └─ icon-512.png
│  │  │  ├─ 📁 js/
│  │  │  │  ├─ 📁 lib/
│  │  │  │  │  ├─ cofre-arquivo.js
│  │  │  │  │  ├─ guia-maikon.js
│  │  │  │  │  ├─ guia-versoes.js
│  │  │  │  │  ├─ jszip.min.js
│  │  │  │  │  ├─ nuvem-neon.js
│  │  │  │  │  └─ reconhecer.js
│  │  │  │  ├─ 00-base.js
│  │  │  │  ├─ 10-banco.js
│  │  │  │  ├─ 12-nuvem.js
│  │  │  │  ├─ 14-entrada.js
│  │  │  │  ├─ 20-provedores.js
│  │  │  │  ├─ 30-memoria.js
│  │  │  │  ├─ 33-contextos.js
│  │  │  │  ├─ 34-guia.js
│  │  │  │  ├─ 35-jeito.js
│  │  │  │  ├─ 36-gasto.js
│  │  │  │  ├─ 37-arquivos.js
│  │  │  │  ├─ 38-codigos.js
│  │  │  │  ├─ 39-qr.js
│  │  │  │  ├─ 40-voz.js
│  │  │  │  ├─ 41-pronto.js
│  │  │  │  ├─ 42-testar.js
│  │  │  │  ├─ 43-links.js
│  │  │  │  ├─ 44-docs.js
│  │  │  │  ├─ 45-mesa.js
│  │  │  │  ├─ 50-internet.js
│  │  │  │  ├─ 60-previa.js
│  │  │  │  ├─ 70-texto.js
│  │  │  │  ├─ 80-chat.js
│  │  │  │  ├─ 85-config.js
│  │  │  │  ├─ 87-cofre.js
│  │  │  │  ├─ 90-backup.js
│  │  │  │  ├─ 91-restaurar.js
│  │  │  │  ├─ 95-ponte-lab.js
│  │  │  │  ├─ 99-app.js
│  │  │  │  ├─ janela-pc.js
│  │  │  │  └─ nuvem-embutida.js
│  │  │  ├─ index.html
│  │  │  ├─ LEIA-ME.txt
│  │  │  ├─ manifest.json
│  │  │  ├─ README.md
│  │  │  └─ sw.js
│  │  ├─ ai-code-studio.html
│  │  ├─ arrumador.html
│  │  ├─ banco-neon.html
│  │  ├─ colador.html
│  │  ├─ faxina.html
│  │  ├─ iara-suite.html
│  │  ├─ juntador.html
│  │  ├─ montador.html
│  │  ├─ numerador.html
│  │  ├─ picotador.html
│  │  ├─ preparador.html
│  │  ├─ projeto-lab.html
│  │  └─ replicador.html
│  ├─ 📁 js/
│  │  ├─ 00-base.js
│  │  ├─ 10-banco.js
│  │  ├─ 20-importar.js
│  │  ├─ 30-analise.js
│  │  ├─ 40-plano.js
│  │  ├─ 50-comparar.js
│  │  ├─ 60-ferramentas.js
│  │  ├─ 70-ia.js
│  │  ├─ 75-memoria.js
│  │  ├─ 80-terminal.js
│  │  ├─ 90-lab-ponte.js
│  │  ├─ 91-lab-base.js
│  │  ├─ 92-lab-mapa.js
│  │  ├─ 93-lab-previa.js
│  │  ├─ 94-lab-desmontar.js
│  │  ├─ 95-fatiador.js
│  │  ├─ 96-recuperar.js
│  │  ├─ 97-brincar.js
│  │  ├─ 98-combinar.js
│  │  ├─ 98w-desembrulhar.js
│  │  ├─ 98x-raiox.js
│  │  ├─ 98x2-raiox-mais.js
│  │  ├─ 98y-grupos.js
│  │  ├─ 98z-navegar.js
│  │  ├─ 99-app.js
│  │  ├─ janela-pc.js
│  │  └─ tema.js
│  ├─ 📁 kits/
│  │  ├─ 📁 receita-montar/
│  │  │  ├─ 📁 js/
│  │  │  │  └─ 40-ferramentas.js
│  │  │  ├─ montar.py
│  │  │  ├─ PEDIDO-PARA-A-IA.txt
│  │  │  ├─ RECEITA-MONTAR.md
│  │  │  └─ receita.json
│  │  ├─ faxina-painel.zip
│  │  ├─ faxina-rapida.zip
│  │  ├─ juntar.py
│  │  ├─ kit-replit.cjs
│  │  ├─ organizar.py
│  │  ├─ servir.py
│  │  └─ voz-francisco.py
│  ├─ 📁 lib/
│  │  ├─ acorn.min.js
│  │  └─ jszip.min.js
│  ├─ cb1.png
│  ├─ index.html
│  ├─ LEIA-ME.txt
│  └─ README.md
├─ 📁 electron/
│  ├─ instalar.nsh
│  ├─ main.cjs
│  ├─ navegador.html
│  ├─ ponte.cjs
│  ├─ preload-nav.cjs
│  ├─ preload.cjs
│  ├─ saude.cjs
│  ├─ terminal.cjs
│  └─ voz.cjs
├─ .gitignore
├─ LEIA-ME.md
└─ package.json
```
