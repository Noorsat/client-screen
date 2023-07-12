let authTokens = JSON.parse(localStorage.getItem("authTokens") || '{}');

export const STD_HEADERS_CASHIER_API = {
  Accept: 'application/json, application/xml, text/plain, text/html, *.*',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${authTokens.access_token}`,
  'Cache-Control': 'no-store'
};

export enum HeadersType {
  Afisha = 'afisha',
}

export const SERVER_URL_CASHIER_API = process.env.REACT_APP_KASSA_CASHIER_API;