import axios from 'axios';
import { SERVER_URL_CASHIER_API, STD_HEADERS_CASHIER_API } from 'src/constants/server';
import { SeatsType, BuyTicketType } from './types';



localStorage.getItem("authTokens") &&
  axios.interceptors.request.use((config) => {
    let authToken = JSON.parse(localStorage.getItem("authTokens") || "");
    config!.headers!.Authorization = `Bearer ${authToken.access_token}`
    return config
  })

localStorage.getItem("authTokens") &&
  axios.interceptors.response.use((config) => {
    return config
  }, async (error) => {
    let authToken = JSON.parse(localStorage.getItem("authTokens") || "");
    if (error.response.status === 401) {
      try {
        const originalRequest = error.config;
        const response = await axios.post(`${SERVER_URL_CASHIER_API}/api/auth/refresh`,
          {
            refresh_token: authToken.refresh_token
          },
          {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Pragma": 'no-cache'
            }
          }
        )
        localStorage.setItem("authTokens", JSON.stringify(response?.data))
        return axios.request(originalRequest)
      } catch (e) {
        localStorage.removeItem("authTokens")
        window.location.reload()
      }
    }
  })

export async function getTickets(skip: number, limit: number, date: string) {
  const url = `${SERVER_URL_CASHIER_API}/api/ticket`;

  const response = await axios.get(
    `${url}?skip=${skip}&limit=${limit}&date_from=${date}`,
    {
      headers: STD_HEADERS_CASHIER_API
    }
  );

  return await response.data;
}

export async function getTicketsByNumber(ticketNumber: string) {
  const url = `${SERVER_URL_CASHIER_API}/api/ticket`;

  const response = await axios.get(
    `${url}?number=${ticketNumber}`,
    {
      headers: STD_HEADERS_CASHIER_API
    }
  );

  return await response.data;
}

export async function getReservationDetail(id: string) {
  const url = `${SERVER_URL_CASHIER_API}/api/ticket/${id}`;

  const response = await axios.get(
    `${url}`,
    {
      headers: STD_HEADERS_CASHIER_API
    }
  );

  return await response;
}


export async function updateTicket(id: string, seats: Array<SeatsType> | any) {
  const url = `${SERVER_URL_CASHIER_API}/api/ticket/${id}`;

  const response = await axios.put(
    `${url}`,
    {
      comment: "test comment",
      seats: seats,
      reason: "some text"
    },
    {
      headers: STD_HEADERS_CASHIER_API,
    }
  )

  return await response;
}

export async function ticketBuyModal(data: BuyTicketType, id: string) {
  const url = `${SERVER_URL_CASHIER_API}/api/ticket/${id}/pay`;

  const response = await axios.put(
    `${url}`,
    {
      comment: "test comment",
      seats: data.seats,
      reason: "some text",
      payment: {
        id: data.payment
      }
    },
    {
      headers: STD_HEADERS_CASHIER_API
    }
  )

  return await response;
}

export async function exportTicket(id: string){
  const url = `${SERVER_URL_CASHIER_API}/api/ticket/${id}/export`;

  const response = await axios.put(
    `${url}`,
    "",
    {
      headers: STD_HEADERS_CASHIER_API
    }
  )

  return await response;
}

export async function printTicket(id: string){
  const url = `${SERVER_URL_CASHIER_API}/api/ticket/${id}/print`;

  const response = await axios.put(
    `${url}`,
    "",
    {
      headers: STD_HEADERS_CASHIER_API
    }
  )

  return await response;
}


export async function buyTicket(data: any){
  const url = `${SERVER_URL_CASHIER_API}/api/ticket/buy`;

  const response = await axios.post(
    `${url}`,
    data,
    {
      headers: STD_HEADERS_CASHIER_API
    }
  )

  return await response;
}

export async function lockSeat(body: any, id: string) {
  const url = `${SERVER_URL_CASHIER_API}/api/seance/${id}/seat/lock`;

  const response = await axios.post(
    `${url}`,
    body,
    {
      headers: STD_HEADERS_CASHIER_API
    }
  )


  return await response;
}


export async function unlockSeat(body: any, id: string) {
  const url = `${SERVER_URL_CASHIER_API}/api/seance/${id}/seat/unlock`;

  const response = await axios.post(
    `${url}`,
    body,
    {
      headers: STD_HEADERS_CASHIER_API
    }
  )

  return await response;
}

export async function getSeatStatus(id: string, seat_id: string) {
  const url = `${SERVER_URL_CASHIER_API}/api/seance/${id}/seat/status?seat=${seat_id}`;
  const response = await axios.get(
    `${url}`,
    {
      headers: STD_HEADERS_CASHIER_API
    }
  )
  return await response;
}

export async function getDevices() {
  const url = `${SERVER_URL_CASHIER_API}/api/device`;

  const response = await axios.get(
    `${url}`,
    {
      headers: STD_HEADERS_CASHIER_API
    }
  )
  return await response;
}