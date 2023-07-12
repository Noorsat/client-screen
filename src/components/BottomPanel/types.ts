import {IBaseProps, IMobileViewProps, ITicket} from 'src/core/components/types';

export declare namespace BottomPanelTypes {
  export interface IProps extends IBaseProps, IMobileViewProps {
    isBasketOpen?: boolean;
    discounts? : any;
    selectedTickets: ITicket[]
  }
}
