import { usePageContext } from './usePageContext';

/** https://vike.dev/useData */
export function useData<Data>() {
  const { data } = usePageContext();
  return data as Data;
}
