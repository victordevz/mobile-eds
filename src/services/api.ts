const BASE_URL = 'http://localhost:3000';

interface ApiError {
  message: string;
  statusCode: number;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: ApiError = {
      message: data?.message ?? `Erro ${response.status}`,
      statusCode: response.status,
    };
    throw error;
  }

  return data as T;
}

export interface AuthResponse {
  token: string;
}

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  oddsHome: number;
  oddsDraw: number;
  oddsAway: number;
  status: 'OPEN' | 'CLOSED';
  startsAt: string;
  createdAt: string;
}

export const authApi = {
  register: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export const gamesApi = {
  list: (token: string) =>
    apiRequest<Game[]>('/games/', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getById: (id: string, token: string) =>
    apiRequest<Game>(`/games/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export interface DepositResponse {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  pixCode: string;
  createdAt: string;
  completedAt: string | null;
}

export interface BalanceResponse {
  balance: number;
}

export const walletApi = {
  getBalance: (token: string) =>
    apiRequest<BalanceResponse>('/wallet/balance', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createDeposit: (amount: number, token: string) =>
    apiRequest<DepositResponse>('/wallet/deposits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount }),
    }),

  getDeposit: (id: string, token: string) =>
    apiRequest<DepositResponse>(`/wallet/deposits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export interface CatalogItem {
  id: string;
  title: string;
  provider: string;
  category: 'SLOTS' | 'CRASH' | 'ROULETTE' | 'BLACKJACK';
  sections: string[];
  badge: string | null;
  multiplier: string | null;
  accent: string | null;
  thumbnail: string | null;
  active: boolean;
  createdAt: string;
}

export interface CatalogResponse {
  data: CatalogItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CatalogParams {
  category?: 'slots' | 'crash' | 'roulette' | 'blackjack';
  provider?: string;
  section?: 'featured' | 'popular' | 'new';
  page?: number;
  limit?: number;
}

export const catalogApi = {
  list: (params: CatalogParams = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.provider) query.append('provider', params.provider);
    if (params.section) query.append('section', params.section);
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.limit !== undefined) query.append('limit', String(params.limit));
    const qs = query.toString();
    return apiRequest<CatalogResponse>(`/catalog/${qs ? `?${qs}` : ''}`);
  },
};
