import {
  HeadersType,
  STD_HEADERS_CASHIER_API,
} from "../constants/server";

const modifyHeader = (options: any, type?: HeadersType) => {
  const header = STD_HEADERS_CASHIER_API;

  const headers = {
    ...header,
    TimeZone: 'Asia/Almaty',
    'Accept-Language': 'ru-RU',
  };

  if (options.withImage) {
    // @ts-ignore
    delete headers['Content-Type'];
  }
  return headers;
};

export const stdApiPOST = (options: any, type?: HeadersType) => {
  return (
    fetch(
      options.url,
      {
        method: 'POST',
        headers: modifyHeader(options, type),
        body: JSON.stringify(options.data || {}),
      },
    )
  );
};

export const stdApiGET = (options: any, type?: HeadersType) => {
  return (
    fetch(
      options.url,
      {
        method: 'GET',
        headers: modifyHeader(options, type),
      },
    )
  );
};

export const stdApiPUT = (options: any, type?: HeadersType) => {
  return (
    options.data ?
      fetch(
        options.url,
        {
          method: 'PUT',
          headers: modifyHeader(options, type),
          body: JSON.stringify(options.data || {}),
        },
      )
      :
      fetch(
        options.url,
        {
          method: 'PUT',
          headers: modifyHeader(options, type),
        },
      )
  );
};
