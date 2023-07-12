import { HallMapReducerTypes } from 'src/store/hallMap/types';

export const parseRawDataToHallSeats = (raw: HallMapReducerTypes.IRawHallSeatsData, zone: any): HallMapReducerTypes.IHallSeats => ({
  id: raw.id,
  height: raw.height,
  rowText: raw.properties.row,
  seatText: raw.properties.col,
  uuid: raw.uuid,
  name: raw.name,
  code: raw.code,
  status: 1,
  width: raw.width,
  x: raw.properties.grid.x,
  y: raw.properties.grid.y,
  zoneId: zone?.id,
  zoneName: zone?.name,
  zoneColor: zone?.color,
  loveSeatReference: raw?.reference,
  ticket: raw.ticket
});

export const parseRawDataToHall = (raw: HallMapReducerTypes.IHallRawData): HallMapReducerTypes.IHall => ({
  id: raw.id,
  uuid: raw.uuid,
  zones: raw.zones.map((zone : any) => {
    return {...zone, seats: zone.seats.map((m: HallMapReducerTypes.IRawHallSeatsData) => parseRawDataToHallSeats(m, zone))}
  }),
  code: raw.code,
  // isHaveEmptySeats: !(raw.seats.some((n: HallMapReducerTypes.IRawHallSeatsData) => n.status === 1)),
  isHaveEmptySeats: true,
  description: raw.description || '',
  screenPosition: raw.properties.screen_position,
  count: raw.count,
  isPerformanceAreaBottom: false,
});
