import { IBaseProps, ISeat } from 'src/core/components/types';
import { ScheduleResponse, ScheduleTypes } from 'src/store/schedule/types';
import { HallMapReducerTypes } from 'src/store/hallMap/types';

export declare namespace HallMapTypes {
  export interface IProps extends IBaseProps {
    seatArray: ISeat[][];
    prices: ScheduleResponse.IGetBySeanceDiscount[];
    ticketsCount: number;
    rowCount: number;
    colCount: number;
    hallMapLoading?: boolean;
    checkSeatRemovability(seat: ISeat): boolean;
    onSelectSeat?(seat: ISeat, label: string, name: string, price: number, discountId: string): void;
    onRemoveSeat?(seat: ISeat): void;
    isPerformanceAreaBottom?: boolean;
    isBasketOpen: boolean | undefined;
    zones:any;
    resetHallMap:any;
    selectedDiscount: number | string | undefined;
  }

  export interface IState {
    rowMarkers: number[];
    seatArray: ISeat[][];
    ticketSelectorExpanded: boolean;
    ticketEditorExpanded: boolean;
    selectedSeat: ISeat;
    isZoomClicked: boolean;
  }
}

export declare namespace HallMapSeatTypes {
  export interface IProps extends IBaseProps {
    seat: ISeat;
    prices: ScheduleResponse.IGetBySeanceDiscount[];
    ticketsCount: number;
    removable: boolean;
    selectable: boolean;
    isZoomClicked: boolean;
    onRemoveSeat?(seat: ISeat): void;
    onSelectSeat?(seat: ISeat, discount: ScheduleTypes.IDiscountInfo, label: string): void;
    onSeatClick?(seat: ISeat): void;
    onSeatEdit?(seat: ISeat): void;
    isBasketOpen?: boolean;
    zones: any;
    resetHallMap: any;
    selectedDiscount: number | string | undefined;
  }
  export interface IState {
    isOpened: boolean;
    isModalVisible: boolean;
  }
}

export const screenImg = '../assets/images/screen.svg';
export const searchPlusImg = 'src/static/img/icons/search-plus.svg';
export const searchMinusImg = 'src/static/img/icons/search-minus.svg';

export enum hallZoneTypes {
  Standart = 'STANDART',
  LoveSeats1 = 'Love seats',
  LoveSeats2 = 'Love seats',
  VIP = 'VIP',
  WheelChair = 'WHEELCHAIR',
}

export enum seatStatuses {
  Empty = -1,
  Unknown = 0,
  Free = 1,
  Selected = 2,
  Reserved = 3,
  Sold = 4,
  Disable = 5,
  FreeReserverd = 6,
  Locked = 7,
  ReservedVip = 8,
}
