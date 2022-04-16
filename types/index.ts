import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

/**
 * api NextApiRequest req.query
 */
export type QueryParamsType = {
  [key: string]: string | string[];
};

/**
 * getServerSideProps req
 */
export type NextReq = IncomingMessage & {
  cookies: NextApiRequestCookies;
};
