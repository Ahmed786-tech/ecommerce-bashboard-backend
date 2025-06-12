declare module '@vercel/node' {
    import { IncomingMessage, ServerResponse } from 'http';
    export interface NowRequest extends IncomingMessage {}
    export interface NowResponse extends ServerResponse {}
  }