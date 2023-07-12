import { combineReducers } from 'redux'
import schedulesReducer from "./schedule/reducer";
import hallMapReducer from "./hallMap/reducer";
import modalSlice from './modal/modalSlice';
import ticketSlice from './ticket/ticketSlice';

const rootReducer = combineReducers({
  schedulesReducer,
  hallMapReducer,
  modalSlice,
  ticketSlice
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>
