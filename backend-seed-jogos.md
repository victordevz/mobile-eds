# Seed — Catálogo de Jogos (CatalogItem)

## Contexto

O app mobile consome a rota `GET /catalog` com os parâmetros `section`, `category` e `provider`.  
Cada item precisa dos campos `gameUrl` (URL do iframe) e `imageUrl` (thumbnail externa, opcional) além dos campos já existentes.

---

## Campos obrigatórios no model

| Campo        | Tipo             | Obrigatório | Descrição                              |
|--------------|------------------|-------------|----------------------------------------|
| `gameUrl`    | `string`         | Sim         | URL do demo/iframe a ser aberto        |
| `imageUrl`   | `string \| null` | Não         | URL de thumbnail externa               |
| `thumbnail`  | `string \| null` | Não         | Alias alternativo aceito pelo app      |

> O app tenta `imageUrl ?? thumbnail`. Se ambos forem `null`, exibe a inicial do título.

---

## Provedores ativos no app

Apenas **Pragmatic Play** e **PG Soft** estão habilitados no filtro do app.

---

## Seed completo

```typescript
const games = [
  // ─── Pragmatic Play ───────────────────────────────────────────────────────
  {
    title: 'Gates of Olympus',
    provider: 'Pragmatic Play',
    category: 'SLOTS',
    sections: ['featured', 'popular'],
    badge: 'HOT',
    multiplier: '5000x',
    accent: '#3A86FF',
    gameUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=pt&cur=BRL&lobbyUrl=about:blank',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Sweet Bonanza',
    provider: 'Pragmatic Play',
    category: 'SLOTS',
    sections: ['featured', 'popular'],
    badge: 'HOT',
    multiplier: '21100x',
    accent: '#FB5607',
    gameUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20fruitsw&lang=pt&cur=BRL&lobbyUrl=about:blank',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Sugar Rush',
    provider: 'Pragmatic Play',
    category: 'SLOTS',
    sections: ['popular', 'new'],
    badge: 'NOVO',
    multiplier: '5000x',
    accent: '#FF006E',
    gameUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20sugarrush&lang=pt&cur=BRL&lobbyUrl=about:blank',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Starlight Princess',
    provider: 'Pragmatic Play',
    category: 'SLOTS',
    sections: ['popular'],
    badge: null,
    multiplier: '5000x',
    accent: '#8338EC',
    gameUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20starlight&lang=pt&cur=BRL&lobbyUrl=about:blank',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Big Bass Bonanza',
    provider: 'Pragmatic Play',
    category: 'SLOTS',
    sections: ['popular'],
    badge: null,
    multiplier: '2100x',
    accent: '#0077B6',
    gameUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs10bbbonanza&lang=pt&cur=BRL&lobbyUrl=about:blank',
    imageUrl: null,
    active: true,
  },

  // ─── PG Soft ──────────────────────────────────────────────────────────────
  // ATENÇÃO: usar m.pgsoft-games.com — public.pg-demo.com não funciona em WebView
  {
    title: 'Fortune Tiger',
    provider: 'PG Soft',
    category: 'SLOTS',
    sections: ['featured', 'popular'],
    badge: 'HOT',
    multiplier: '2500x',
    accent: '#FF6B00',
    gameUrl: 'https://m.pgsoft-games.com/44/index.html?l=pt&ot=98&btt=2&from=https%3A%2F%2Fpgsoft.com&__refer=m.pgsoft-games.com&or=static.pgsoft-games.com',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Mahjong Ways',
    provider: 'PG Soft',
    category: 'SLOTS',
    sections: ['popular'],
    badge: null,
    multiplier: '1500x',
    accent: '#E63946',
    gameUrl: 'https://m.pgsoft-games.com/50/index.html?l=pt&ot=98&btt=2&from=https%3A%2F%2Fpgsoft.com&__refer=m.pgsoft-games.com&or=static.pgsoft-games.com',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Fortune Mouse',
    provider: 'PG Soft',
    category: 'SLOTS',
    sections: ['featured', 'new'],
    badge: 'NOVO',
    multiplier: '1000x',
    accent: '#FFD60A',
    gameUrl: 'https://m.pgsoft-games.com/53/index.html?l=pt&ot=98&btt=2&from=https%3A%2F%2Fpgsoft.com&__refer=m.pgsoft-games.com&or=static.pgsoft-games.com',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Wild Bandito',
    provider: 'PG Soft',
    category: 'SLOTS',
    sections: ['popular'],
    badge: null,
    multiplier: '2500x',
    accent: '#FF6B35',
    gameUrl: 'https://m.pgsoft-games.com/92/index.html?l=pt&ot=98&btt=2&from=https%3A%2F%2Fpgsoft.com&__refer=m.pgsoft-games.com&or=static.pgsoft-games.com',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Leprechaun Riches',
    provider: 'PG Soft',
    category: 'SLOTS',
    sections: ['new'],
    badge: 'NOVO',
    multiplier: '2000x',
    accent: '#2DC653',
    gameUrl: 'https://m.pgsoft-games.com/45/index.html?l=pt&ot=98&btt=2&from=https%3A%2F%2Fpgsoft.com&__refer=m.pgsoft-games.com&or=static.pgsoft-games.com',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Candy Superwin',
    provider: 'PG Soft',
    category: 'SLOTS',
    sections: ['new'],
    badge: 'NOVO',
    multiplier: '3000x',
    accent: '#FF85A1',
    gameUrl: 'https://m.pgsoft-games.com/91/index.html?l=pt&ot=98&btt=2&from=https%3A%2F%2Fpgsoft.com&__refer=m.pgsoft-games.com&or=static.pgsoft-games.com',
    imageUrl: null,
    active: true,
  },
];

for (const game of games) {
  await prisma.catalogItem.upsert({
    where: { title: game.title },
    update: { gameUrl: game.gameUrl, active: game.active },
    create: game,
  });
}
```

---

## Observações

- **PG Soft**: o servidor `public.pg-demo.com` bloqueia carregamento em WebView nativa. Usar obrigatoriamente `m.pgsoft-games.com` com os query params completos conforme exemplo acima.
- **`sections`**: o app filtra por `featured`, `popular` e `new` — um jogo pode estar em múltiplas seções.
- **`accent`**: cor de fundo do card quando não há thumbnail. Manter os valores acima para consistência visual.
- Se já existirem registros, usar `upsert` pelo campo `title` para evitar duplicatas.
