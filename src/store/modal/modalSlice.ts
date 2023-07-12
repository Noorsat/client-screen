import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isModalOpen: Boolean;
  reserveNumber: string;
}

const initialState: ModalState = {
  isModalOpen: false,
  reserveNumber: ''
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setOpenModal(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action?.payload;
    },
    setNumberReserve(state, action: PayloadAction<string>) {
      state.reserveNumber = action?.payload;
    },
  },
});

export const { setOpenModal, setNumberReserve } = modalSlice.actions;

export default modalSlice.reducer;
