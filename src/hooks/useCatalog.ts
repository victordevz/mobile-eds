import { useEffect, useState } from 'react';
import { catalogApi, CatalogItem, CatalogParams } from '../services/api';

interface UseCatalogState {
  data: CatalogItem[];
  loading: boolean;
  error: string | null;
}

export function useCatalog(params: CatalogParams = {}): UseCatalogState {
  const [state, setState] = useState<UseCatalogState>({
    data: [],
    loading: true,
    error: null,
  });

  const { category, section, provider, page, limit } = params;

  useEffect(() => {
    if (limit === 0) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState(prev => ({ ...prev, loading: true, error: null }));

    catalogApi
      .list({ category, section, provider, page, limit })
      .then(res => {
        if (!cancelled) setState({ data: res.data, loading: false, error: null });
      })
      .catch(err => {
        if (!cancelled)
          setState({ data: [], loading: false, error: (err as { message?: string }).message ?? 'Erro ao carregar catálogo' });
      });

    return () => {
      cancelled = true;
    };
  }, [category, section, provider, page, limit]);

  return state;
}
