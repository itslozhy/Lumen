# LUMEN: O Jardim do Fim

Jogo de plataforma/ação em pixel art, feito em HTML5 Canvas e JavaScript puro, sem dependências nem etapa de build.

## Como jogar

**Jogue online:** https://itslozhy.github.io/Lumen/

Para rodar localmente, abra o `index.html` no navegador ou suba um servidor local:

```bash
python3 -m http.server 8000
```

Depois acesse http://localhost:8000.

## Controles

| Ação | Teclas |
| --- | --- |
| Mover | ← → / A D |
| Pular (pulo duplo, pulo na parede) | Espaço / Z / ↑ / W |
| Atacar | X / J |
| Dash | C / Shift esquerdo |
| Interagir | E |
| Curar | H / 1 |
| Mana | 2 |
| Mapa | M |
| Álbum | L |
| Pausar | Esc / P |
| Confirmar | Enter |

O progresso fica salvo no `localStorage` do navegador.

## Estrutura

```
index.html          página do jogo (carrega o CSS e os scripts em ordem)
css/style.css       estilos da página
js/core/            configuração, entrada, loop principal (classe Game)
js/world/           mapa, zonas, inimigos e objetos do mundo
js/entities/        jogador, inimigos, projéteis e chefe
js/features/        camadas de funcionalidade, aplicadas em ordem (01 → 31)
js/data/            sprites embutidos (PNG em base64)
js/main.js          inicialização
tools/build.py      gera dist/lumen.html, o jogo num arquivo só
```

Para gerar a versão em arquivo único (para publicar como artifact ou enviar a alguém):

```bash
python3 tools/build.py
```

Detalhes da arquitetura estão no [CLAUDE.md](CLAUDE.md).
