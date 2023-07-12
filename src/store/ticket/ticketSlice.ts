import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SeatsState {
  seats: Array<updateSeatsType>;
  payment: string;
  selectedSeats: Array<updateSeatsType>;
  loading: boolean;
  selectedTicket:string
}

type updateSeatsType = {
  id: string;
  discount_id: string;
}

const initialState: SeatsState = {
  seats: [],
  payment: '',
  selectedSeats: [],
  loading: false,
  selectedTicket: ''
};

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setUpdateSeats(state, action: PayloadAction<updateSeatsType[]>) {
      state.seats = action?.payload;
    },
    saveSelectedSeats(state, action: PayloadAction<updateSeatsType[]>) {
      state.selectedSeats = action?.payload;
    },
    setSelectedPayment(state, action: PayloadAction<string>) {
      state.payment = action?.payload;
    },
    loadData(state, action: PayloadAction<boolean>) {
      state.loading = action?.payload;
    },
    setSelectedTicket(state, action: PayloadAction<string>){
      state.selectedTicket = action?.payload
    }
  },
});

export const { setUpdateSeats, setSelectedPayment, saveSelectedSeats, loadData, setSelectedTicket } = ticketSlice.actions;

export default ticketSlice.reducer;
