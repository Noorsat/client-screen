type seatsType = {
  discount_id: string;
  discount_name: string;
  id: string;
  price: number;
  row: string;
  seat: string;
  zone_color: string;
  zone_id: number;
}

type paymentsType = {
  id: string;
  name: string;
}

type discountType = {
  id: string;
  name: string;
  price: number;
}

export type ReservationType = {
  id: string;
  number: string;
  created_at: string;
  movie: string;
  status: number;
  seats: Array<seatsType>;
  payment: {
    id: string;
    name: string;
  }
  hall: string;
  seance_date: string;
  discounts: Array<discountType>;
}

export type ReservationTypeList = {
  amount: number;
  contract: string;
  id: string;
  movie: string;
  number: string;
  status?:number;
}

export type SeatsType = {
  id: string;
  discount_id: string;
}

export type BuyTicketType = {
  seats: Array<SeatsType>,
  payment: string;
}