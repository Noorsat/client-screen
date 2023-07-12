import { IBaseProps, ISeat } from 'src/core/components/types';
import { ScheduleResponse, ScheduleTypes } from 'src/store/schedule/types';


export declare namespace SchedulePriceHintTypes {
  export interface IProps extends IBaseProps {
    selectable?: boolean;
    removable?: boolean;
    prices?: ScheduleResponse.IGetBySeanceDiscount[];
    selected?: string;
    seat?: ISeat | any;
    onTicketRemove?(): void;
    onTicketSelect?(label: string, discount: ScheduleTypes.IDiscountInfo, seat?: ISeat): void;
    selectedDiscount?: any
  }
}