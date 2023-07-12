import {ISeat} from "../core/components/types";
import {hallZoneTypes} from "../components/HallMap/types";
import {HallMapReducerTypes} from "../store/hallMap/types";

export const checkEmptyStrings = (data: string[]):string[] => data.filter(item  => item !== '');

export const isSeatWheelchair = (seat: ISeat) => (seat.zoneName && seat.zoneName === hallZoneTypes.WheelChair);
export const isSeatLoveSeats1 = (seat: ISeat) => (seat.zoneName && seat.zoneName === hallZoneTypes.LoveSeats1);
export const isSeatLoveSeats2 = (seat: ISeat) => (seat.zoneName && seat.zoneName === hallZoneTypes.LoveSeats2);
export const isSeatVIP = (seat: ISeat) => seat.zoneName && seat.zoneName === hallZoneTypes.VIP;

export const isHallMapContainsZone = (seatZoneType: hallZoneTypes, hallZones?: HallMapReducerTypes.IHallZones) => (
  hallZones && Object.keys(hallZones).some((n: string) => hallZones[n].type === seatZoneType)
);
