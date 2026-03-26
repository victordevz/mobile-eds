# Backend Tasks — Suporte a Jogos de Cassino (WebView)

## 1. Schema — Novos campos no CatalogItem

Adicionar dois campos ao model `CatalogItem`:

| Campo      | Tipo              | Obrigatório | Descrição                                   |
|------------|-------------------|-------------|---------------------------------------------|
| `gameUrl`  | `string`          | Sim         | URL do iframe/demo do jogo                  |
| `imageUrl` | `string \| null`  | Não         | URL do ícone/thumbnail externo do jogo      |

### Prisma (se aplicável)

```prisma
model CatalogItem {
  // campos existentes ...
  gameUrl  String
  imageUrl String?
}
```

### Migration

```bash
npx prisma migrate dev --name add-game-url-image-url
```

---

## 2. Seed — Dados de jogos demo reais

Usar URLs de demo gratuitas dos provedores para popular o banco com jogos jogáveis.

### Pragmatic Play

Demo server: `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol={code}&lang=pt&cur=BRL&lobbyUrl=about:blank`

| Título              | Code            | Categoria | Seções               |
|---------------------|-----------------|-----------|----------------------|
| Gates of Olympus    | vs20olympgate   | SLOTS     | featured, popular    |
| Sweet Bonanza       | vs20fruitsw     | SLOTS     | featured, popular    |
| Sugar Rush          | vs20sugarrush   | SLOTS     | popular, new         |
| Starlight Princess  | vs20starlight   | SLOTS     | popular              |
| Big Bass Bonanza    | vs10bbbonanza   | SLOTS     | popular              |

**imageUrl pattern:** `https://www.slotcatalog.com/userfiles/image/games/{game-id}/GameIcon/{filename}.png` (buscar manualmente ou usar thumbnails próprios)

### PG Soft

Demo server: `https://public.pg-demo.com/games/play/?gid={id}&lang=pt&currency=BRL`

| Título             | Game ID | Categoria | Seções          |
|--------------------|---------|-----------|-----------------|
| Mahjong Ways       | 50      | SLOTS     | popular         |
| Fortune Mouse      | 53      | SLOTS     | featured, new   |
| Wild Bandito       | 92      | SLOTS     | popular         |
| Leprechaun Riches  | 45      | SLOTS     | new             |
| Candy Superwin     | 91      | SLOTS     | new             |

### Betsoft

Demo server: `https://betsoft.com/play-demo?id={id}`

| Título                      | Game ID | Categoria | Seções          |
|-----------------------------|---------|-----------|-----------------|
| 3 Pots of Wishes            | 7533    | SLOTS     | new             |
| Dr. Jekyll & Mr. Hyde 2     | 7508    | SLOTS     | popular         |
| The King of Social Media     | 7298    | SLOTS     | new             |

### Exemplo de seed (TypeScript / Prisma)

```typescript
const games = [
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
  {
    title: 'Mahjong Ways',
    provider: 'PG Soft',
    category: 'SLOTS',
    sections: ['popular'],
    badge: null,
    multiplier: '1500x',
    accent: '#E63946',
    gameUrl: 'https://public.pg-demo.com/games/play/?gid=50&lang=pt&currency=BRL',
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
    gameUrl: 'https://public.pg-demo.com/games/play/?gid=53&lang=pt&currency=BRL',
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
    gameUrl: 'https://public.pg-demo.com/games/play/?gid=92&lang=pt&currency=BRL',
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
    gameUrl: 'https://public.pg-demo.com/games/play/?gid=45&lang=pt&currency=BRL',
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
    gameUrl: 'https://public.pg-demo.com/games/play/?gid=91&lang=pt&currency=BRL',
    imageUrl: null,
    active: true,
  },
  {
    title: '3 Pots of Wishes',
    provider: 'Betsoft',
    category: 'SLOTS',
    sections: ['new'],
    badge: 'NOVO',
    multiplier: '1200x',
    accent: '#7209B7',
    gameUrl: 'https://betsoft.com/play-demo?id=7533',
    imageUrl: null,
    active: true,
  },
  {
    title: 'Dr. Jekyll & Mr. Hyde 2',
    provider: 'Betsoft',
    category: 'SLOTS',
    sections: ['popular'],
    badge: null,
    multiplier: '800x',
    accent: '#4A4E69',
    gameUrl: 'https://betsoft.com/play-demo?id=7508',
    imageUrl: null,
    active: true,
  },
  {
    title: 'The King of Social Media',
    provider: 'Betsoft',
    category: 'SLOTS',
    sections: ['new'],
    badge: 'NOVO',
    multiplier: '1500x',
    accent: '#FF9F1C',
    gameUrl: 'https://betsoft.com/play-demo?id=7298',
    imageUrl: null,
    active: true,
  },
];

for (const game of games) {
  await prisma.catalogItem.create({ data: game });
}
```

---

## 3. Endpoint existente

O `GET /catalog/` ja retorna `CatalogResponse` com os items. Basta garantir que `gameUrl` e `imageUrl` estejam incluidos na serializacao.

Nenhum endpoint novo e necessario para demos estaticos.

---

## 4. (Opcional) Endpoint de launch dinamico

Se no futuro algum provedor exigir URL de sessao autenticada:

```
GET /catalog/:id/launch
Authorization: Bearer {token}

Response: { launchUrl: string }
```

Para demos estaticos, nao e necessario.

---

## 5. Dominios permitidos (referencia para frontend)

O frontend restringe navegacao do WebView a estes dominios:

- `demogamesfree.pragmaticplay.net`
- `public.pg-demo.com`
- `betsoft.com`

Novos provedores precisam ter seus dominios adicionados na whitelist do frontend.
