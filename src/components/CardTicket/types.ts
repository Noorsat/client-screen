import { ITicket } from 'src/core/components/types';
import { ScheduleTypes } from 'src/store/schedule/types';

export declare namespace CardTicketTypes {
  export interface IProps {
    ticket: ITicket;
    selectedTickets?: ITicket[];
    hasOptions?: boolean;
    removable?: boolean;
    prices?: ScheduleTypes.IDiscount;
    priceVIP?: ScheduleTypes.IDiscount;
    onRemoveTicket?(ticket: any): void;
    onChangeTariff?(tariffLabel: string, price: number): void;
  }
}

export declare namespace GroupCardTicketTypes {
  export interface IProps {
    tickets: ITicket[];
    hasOptions?: boolean;
    prices?: ScheduleTypes.IDiscount;
    priceVIP?: ScheduleTypes.IDiscount;
    onRemoveTicket?(ticket: ITicket): void;
    onChangeTariff?(ticket: ITicket, tariffLabel: string, price: number): void;
    checkTicketRemovability?(ticket : ITicket): boolean;
  }
}

export declare namespace GroupCardTicketExpandableTypes {
  export interface IProps {
    tickets: ITicket[];
  }
}

export const ticketsLogo = 'src/static/img/icons/tickets.svg';
export const ellipsisV = 'src/static/img/icons/ellipsisV.svg';
