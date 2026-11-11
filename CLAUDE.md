# LUMEN: O Jardim do Fim

Jogo de plataforma/ação gótico em pixel art (estilo metroidvania), em HTML5 Canvas e JavaScript puro. Não usa framework, dependências nem bundler. Todo o texto do jogo, os comentários e a comunicação com o autor são em **português do Brasil**.

O jogo é publicado pelo GitHub Pages a partir da `main` (raiz do repositório): https://itslozhy.github.io/Lumen/. **Todo push na `main` vai para o ar**, então mudanças grandes devem ir num branch e entrar na `main` só depois da aprovação do autor.

## Como rodar e testar

- Abrir `index.html` direto no navegador funciona, porque os sprites estão embutidos em JS.
- Servidor local: `python3 -m http.server 8000` e acessar http://localhost:8000.
- `python3 tools/build.py` gera `dist/lumen.html` (jogo inteiro num arquivo só, para artifact ou distribuição). `dist/` não é versionado.
- Não há testes automatizados. Para validar uma mudança, abra o jogo com Playwright (Chromium já instalado), capture erros de `pageerror`/`console`, use o teclado para chegar até a parte alterada e tire screenshots do `#game-canvas`. A abertura é uma cinemática: `Enter` avança e `Esc` pula.

## Arquitetura

O `index.html` carrega ~45 scripts clássicos (sem `type="module"`), **em ordem**. Todos compartilham o escopo global, e a ordem das tags `<script>` faz parte do comportamento.

```
css/style.css            tela de carregamento e container do canvas
js/core/config.js        CONFIG: física, jogador, paleta (CONFIG.COLORS → C), SAVE_KEY
js/core/input.js         teclado (wasPressed = borda de subida no frame)
js/data/*.js             sprites PNG em base64 (gerados; não editar à mão)
js/core/utils.js         C, T (tile = 16px), tamanho do mundo, clamp/rectOverlap/dist
js/core/assets.js        carrega ASSET_DATA
js/core/particles.js     sistema de partículas
js/world/world.js        ZONES (salas/áreas), buildWorld/Interactives/Enemies/Movers/Hazards
js/entities/*.js         Player, Enemy, Projectile, Boss
js/core/game.js          classe Game: estados, loop, câmera, save/load, desenho base
js/core/env.js           ENV: slots de imagens de cenário
js/features/NN-*.js      31 camadas de funcionalidade, aplicadas em ordem
js/main.js               boot(): tela de carregamento → new Game(canvas).start()
```

### Camadas de funcionalidade (`js/features/`)

Cada arquivo é uma IIFE `(function(){ ... })();` que **estende o jogo por cima do que veio antes**, normalmente envolvendo métodos de `Game.prototype`:

```js
(function(){
const G=Game.prototype;
const oU=G.update;
G.update=function(dt){ oU.call(this,dt); /* comportamento novo */ };
})();
```

- O número no nome do arquivo define a ordem. Camadas posteriores podem substituir o desenho/lógica das anteriores (ex.: `24-colagem-ui`, `28-ui-monitor` e `30-hud-ps1` redesenham a HUD; a última vence). Antes de alterar algo, procure com `grep` **todas** as camadas que mexem naquele método.
- Métodos mais envolvidos: `update`, `drawWorld`, `handleInteractions`, `continueGame`, `saveGame`, `drawHUD`, `draw`.
- Camadas trocam dados via globais em `window` (`window.COL`, `window.__UIK`, `window.ART`, `window.SPRS`, `window.LUMEN_DATA` etc.).
- Save: `localStorage[CONFIG.SAVE_KEY]` em JSON. Cada camada que guarda estado envolve `saveGame`/`continueGame` e acrescenta seus campos ao mesmo objeto. Mudar a estrutura do save de forma incompatível exige trocar `SAVE_KEY`.
- `27-abertura-cinematicas.js` é a maior camada (~1.600 linhas): abertura, quarto/computador, Casa Desfeita, cenas do mini chefe e do chefe, morte/rebobinar e Orfanato. Tem subseções marcadas com `// =====`.
- Para funcionalidade nova, prefira **um arquivo novo** `js/features/NN-nome.js` no fim da lista, adicionado ao `index.html` antes de `js/main.js`.

### Estilo de código

O código existente é denso, com nomes curtos e várias instruções por linha. Ao editar, mantenha o estilo do arquivo; não reformate arquivos inteiros, para não poluir o histórico.

## Jogo

- Protagonista: **Mika**. Variações/ressonâncias: **Kaim** e **Kami**. Escolhas e memórias (Finalizar/Libertar) mudam o caminho.
- Resolução interna: 640×360, tiles de 16px, escala inteira (pixel art; `imageSmoothingEnabled=false`).
- Zonas: Quarto Desfeito, Corredor das Molduras, Galeria Quebrada, Biblioteca Morta, Sótão Invertido, Torre do Relógio, Salão Afundado, Passagem do Porão, Poço das Escadas, Porão de Costuras, Galerias Inferiores, Capela Desativada, Jardim Interno, Corredor dos Espelhos, Observatório, Antecâmara, Câmara da Lacuna.
- Controles: ←→/AD mover · Espaço/Z/↑/W pular (pulo duplo, pulo na parede) · X/J atacar · C/Shift dash · E interagir · H/1 cura · 2 mana · M mapa · L álbum · Esc/P pausa.
- Estética: gótica, roxo/rosa velho/marfim (paleta em `CONFIG.COLORS`), interfaces de terminal/fita cassete antigos.

## Origem

O projeto começou como um artifact do Claude ("LUMEN: O Jardim do Fim"). O primeiro commit contém o arquivo único original. A separação em arquivos foi verificada remontando o script a partir dos arquivos novos e comparando com o original, linha a linha. Agora o repositório é a versão oficial; o artifact não é mais atualizado.
