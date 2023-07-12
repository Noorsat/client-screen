import axios from 'axios';
import { SERVER_URL_CASHIER_API } from 'src/constants/server';
import * as SentryBrowser from '@sentry/browser';

export const defaultAction = (dispatch: any, getState: any, options: any, responseType?: string) => {
  const callbacks = options.callbacks || {};
  dispatch(options.onStart ? { type: options.action.started, ...options.onStart() } : { type: options.action.started });
  options.apiCall()
    .then(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 201:
            response
              .text()
              .then(
                (value: any) => {
                  if (responseType) {
                    const responseObject = `data:image/png;base64,${value}`;
                    dispatch({
                      type: options.action.success,
                      ...options.onSuccess(responseObject),
                    });
                    if (callbacks.onSuccess) {
                      callbacks.onSuccess(options.onSuccess(responseObject));
                    }
                  } else {
                    const responseObject = JSON.parse(value);
                    dispatch({
                      type: options.action.success,
                      ...options.onSuccess(responseObject),
                    });
                    if (callbacks.onSuccess) {
                      callbacks.onSuccess(options.onSuccess(responseObject));
                    }
                  }
                },
              );
            break;
          case 230:
          case 210:
          case 231:
          case 239:
            response
              .text()
              .then(
                (value: any) => {
                  dispatch({
                    type: options.action.success,
                    ...options.onSuccess(true),
                  });
                  if (callbacks.onSuccess) {
                    callbacks.onSuccess(options.onSuccess(true));
                  }
                },
              );
            break;
          case 400:
          case 401:
            response
              .json()
              .then((val: any) => {
                let authTokens = JSON.parse(localStorage.getItem("authTokens") || "");
                const url = `${SERVER_URL_CASHIER_API}/api/auth/refresh`;

                axios.post(
                  `${url}`,
                  {
                    refresh_token: authTokens.refresh_token
                  }
                ).then((response) => {
                  localStorage.setItem("authTokens", JSON.stringify(response.data))
                  response.headers.Authorization = `Bearer ${response.data.access_token}`
                  window.location.reload()
                }).catch((err) => {
                  localStorage.removeItem("authTokens")
                  window.location.reload()
                })
              })
            break;
          case 404: 
            console.log('404')   
            
            SentryBrowser.init({
              dsn: process.env.REACT_APP_SENTRY_SDN,
            });
            
            const eventId = SentryBrowser.captureMessage('User Feedback');
            
            const userFeedback = {
              event_id: eventId,
              name: 'John Doe',
              email: 'john@doe.com',
              comments: 'I really like your App, thanks!'
            }
            
            SentryBrowser.captureUserFeedback(userFeedback);
            break;
          case 406:
            response
              .json()
              .then((val: any) => {
                dispatch({
                  type: options.action.failed,
                  ...options.onError({ message: val.message || 'serverError', status: val.status }),
                });
              });
            break;
          case 412:
            response
              .json()
              .then((val: any) => {
                dispatch({
                  type: options.action.failed,
                  ...options.onError({ message: val.message || 'serverError', status: val.status }),
                });
              });
            break;
          case 500:
            response
              .json()
              .then((val: any) => {
                dispatch({
                  type: options.action.failed,
                  ...options.onError({ message: val.message || 'serverError', status: val.status }),
                });
              });
            break;
          case 504:
            response
              .text()
              .then((val: any) => {
                dispatch({
                  type: options.action.failed,
                  ...options.onError({ message: 'serverError' }),
                });
              });
            break;
          default:
            dispatch({
              type: options.action.failed,
              errorMessage: `${response.status}`,
            });
        }
      },
      (error: any) => {
        dispatch({
          type: options.action.failed,
          errorMessage: 'Проверьте соеденение',
          ...options.onError({ message: 'serverError' }),
        });
      },
    );
};
