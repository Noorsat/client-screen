import {ITicket} from "../../core/components/types";

export declare namespace FormKeyboardTypes {
  export interface IProps {
    seanceId: string;
    selectedTickets: ITicket[];
    onCloseModal(): void;
    setSelectedTickets: any;
  }
}
