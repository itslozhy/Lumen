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
| Pausar | Esc / P |
| Confirmar | Enter |

O progresso fica salvo no `localStorage` do navegador.

## Estrutura

Hoje o jogo está num único arquivo, `index.html`, com CSS, código e sprites (PNG em base64) embutidos. Ele veio do artifact do Claude em que o projeto começou.
