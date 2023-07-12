export interface IMultipleSeats{
    prices: [
        {
            id: string;
            type: string;
            value: number;
            name: string;
            code: string;
            zoneId:any;
        }
    ],
    selectedDiscount: number | string | undefined,
    selectDiscountHandler : (id : number | string) => void;
}