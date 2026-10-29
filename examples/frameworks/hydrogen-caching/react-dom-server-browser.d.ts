// The browser build of react-dom/server includes `renderToReadableStream` (the
// Node.js build doesn't). @types/react-dom doesn't declare this subpath, so we
// do it here.
declare module 'react-dom/server.browser' {
  export {renderToReadableStream} from 'react-dom/server';
}

