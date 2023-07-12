import axios from 'axios';
import { SERVER_URL_CASHIER_API } from 'src/constants/server';

export async function login(data: any) {
  const url = `${SERVER_URL_CASHIER_API}/api/auth/login`;

  const response = await axios.post(
    `${url}`,
    data,
  ).catch(function (error){
    return error.response
  })

  return await response;
}
