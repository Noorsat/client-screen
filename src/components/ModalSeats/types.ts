import { IBaseProps, IMobileViewProps, ITicket } from 'src/core/components/types';
import { ScheduleResponse, ScheduleTypes } from 'src/store/schedule/types';

export declare namespace ModalSeatsTypes {
  export interface IProps extends IBaseProps, IMobileViewProps {
    schedule: ScheduleResponse.IGetBy; // TODO: check
    scheduleLoading?: boolean;
    isBasketOpen?: boolean;
    isClearTickets?: boolean;
    step: number;
    day: string;
    ticketsTotalPrice?: number;
    cookieTickets: ITicket[];
    selectedTickets: ITicket[];
    setIsClearTickets?(bool: boolean): void;
    setSelectedTickets(tickets: ITicket[]): void;
    onStateReservationDiscountsApply?(orderId: string): void;
    onTicketsTotalPriceChange?(totalSum: number): void;
    firstPopup: boolean;
    setFirstPopup: any;
    onRemoveSeat: any;
    rowColCount:any;
    setRowColCount:any;
    seatArray:any;
    setSeatArray:any;
    onBuyClick: any;
  }
}

export const iconWheelchair = '/static/img/icons/wheelchair.svg';
