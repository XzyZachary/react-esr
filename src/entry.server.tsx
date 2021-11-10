import ReactDOMServer from 'react-dom/server'
import { StaticRouter, Route } from 'react-router-dom'
import { routes } from './router'
import { matchRoutes } from 'react-router-config'
import consola from 'consola'

export async function render(url: string, events: any) {
  const { pathname } = new URL(url);
  const branch = matchRoutes(routes, pathname);
  const route = branch[0]?.route;
  const MatchedComponent = route?.component as any;
  const initialData = MatchedComponent?.getInitialProps
    ? await MatchedComponent?.getInitialProps(route)
    : {}
  const renderContent = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <MatchedComponent data={initialData}/>
    </StaticRouter>
  )
  // @ts-ignore
  const template = process.SSR.html
  return template
    .replace(
      '<!-- ssr-out-let -->',
      `<div id="root" data-server-rendered="true">${renderContent}</div>`
    )
    .replace(
      '<!-- ssr-initial-data -->',
      `<script>window.__INITIAL_STATE__=${JSON.stringify(initialData)}</script>`
    )
}