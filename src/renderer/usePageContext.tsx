import React, { useContext } from 'react';
import type { PageContext } from 'vike/types';

const Context = React.createContext<PageContext>(undefined as unknown as PageContext);

export function PageContextProvider(props: {
  pageContext: PageContext;
  children: React.ReactNode;
}) {
  return <Context.Provider value={props.pageContext}>{props.children}</Context.Provider>;
}

/** https://vike.dev/usePageContext */
// eslint-disable-next-line react-refresh/only-export-components
export function usePageContext() {
  const pageContext = useContext(Context);
  return pageContext;
}
