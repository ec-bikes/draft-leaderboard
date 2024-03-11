// https://vike.dev/onRenderHtml

import ReactDOMServer from 'react-dom/server';
import { PageShell } from './PageShell';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import logoUrl from './logo.svg';
import type { OnRenderHtmlAsync } from 'vike/types';
import { getPageTitle } from './getPageTitle';

export const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext,
): ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext;
  if (!Page) throw new Error('My onRenderHtml() hook expects pageContext.Page to be defined');

  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page />
    </PageShell>,
  );

  // See https://vike.dev/head
  const title = getPageTitle(pageContext);
  const desc =
    pageContext.data?.description || pageContext.config.description || 'Demo of using Vike';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
    },
  };
};
