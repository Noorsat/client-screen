import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { stringify } from 'zipson';
import { ISeat, ITicket } from 'src/core/components/types';
import hallMapActions, { getHallPlan, getSeatsStatus, ticketBuy } from 'src/store/hallMap/actions';
import HallMap from 'src/components/HallMap';
import { HallMapReducerTypes } from 'src/store/hallMap/types';
import Cookies from 'js-cookie';
import { ModalSeatsTypes } from 'src/components/ModalSeats/types';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import Typography from "../Typography";
import classNames from "classnames";
import Divider from "../Divider";
import './index.scss';
import Slider from "react-slick";
import { timeTransform } from "../../utils/transform";
import { TEXT_TIME_FORMAT } from "../../constants/date";
import { ScheduleResponse } from "../../store/schedule/types";
import { Popup } from "../Popup";
import { useNavigate } from "react-router-dom";
import { getScheduleDetail } from 'src/store/schedule/actions';
import { isTimeWillPass } from "../../utils/date";
import MultipleSeats from '../MultipleSeats';
import { lockSeat, unlockSeat } from 'src/store/ticket';
import { notification } from 'antd';
import * as io from "socket.io-client"
const socket = io.connect('192.168.70.150:3000');

function ModalSeats(props: ModalSeatsTypes.IProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const side = localStorage.getItem("side")

  const [scheduleData, setScheduleData] = useState<any>();
  const [selectedDiscount, setSelectedDiscount] = useState<number | string>(0);

  const selectDiscountHandler = (id: number | string) => {
    // if (selectedDiscount === id) {
    //   setSelectedDiscount(0)
    // } else {
    //   setSelectedDiscount(id);
    // }
  }

  const {
    schedule,
    cookieTickets,
    selectedTickets,
    setSelectedTickets,
    isClearTickets,
    firstPopup,
    onBuyClick
  } = props;

  const hallMap = useSelector((state: RootState) => state.hallMapReducer.halls.data);
  const hallSeatsStatus = useSelector((state: RootState) => state.hallMapReducer.seatsStatus.data);
  const hallSeatsStatusLoading = useSelector((state: RootState) => state.hallMapReducer.seatsStatus.loading);
  const ticketReserveState = useSelector((state: RootState) => state.hallMapReducer.ticketReserveState.data);
  const ticketBuyState = useSelector((state: RootState) => state.hallMapReducer.ticketBuyState.data);

  // TODO: see behavior
  React.useEffect(
    () => {
      scheduleData?.seance?.id && initHallMap();
    },
    [scheduleData?.seance?.id],
  );

  useEffect(() => {
    setScheduleData(props.schedule);
  }, [])

  React.useEffect(() => {
    socket && socket.on('lockSeatResponse', (data : any) => {
      if (side === "client"){
        console.log(data)
          changeSeatStatus(data.seat, 2, data?.label, data?.seatArray);
          setSelectedTickets(data?.updatedSelectedTickets);
          handleTicketPriceSum(data?.updatedSelectedTickets);
          updateGlobalSelectedTickets(data?.updatedSelectedTickets);
      }
    })
    socket && socket.on('unlockAllResponse', (data : any) => {
      if (side === "client"){
        if (data.success){
          data?.selectedTickets?.forEach((n: ITicket) => {
            changeSeatStatus(n.seat, 1);
          });
          setSelectedTickets([]);
          updateGlobalSelectedTickets([]);
          updateGlobalTicketTotalPrice(0);
        }else if (data.error){
          
        }
      }
    })
  }, [socket])

  React.useEffect(
    () => {
      if (ticketReserveState?.id) {
        selectedTickets.forEach((n: ITicket) => {
          changeSeatStatus(n.seat, 3);
        });
        updateGlobalSelectedTickets([]);
        updateGlobalTicketTotalPrice(0);
      }
    },
    [ticketReserveState],
  );

  React.useEffect(
    () => {
      if (ticketBuyState?.id) {
        selectedTickets.forEach((n: ITicket) => {
          changeSeatStatus(n.seat, 4);
        });
        setSelectedTickets([]);
        updateGlobalSelectedTickets([]);
        updateGlobalTicketTotalPrice(0);
      }
    },
    [ticketBuyState],
  );
  React.useEffect(
    () => {
      hallMap && (hallSeatsStatus === null || hallSeatsStatus) && changeRowAndColCount(hallMap);
      hallMap && (hallSeatsStatus === null || hallSeatsStatus) && props.setSeatArray(getHallMap(hallMap));
      // hallMap && hallMap.isHaveEmptySeats && hallMap.isHaveEmptySeats && setShowSeatsBusyAlert(true);
    },
    [hallMap, hallSeatsStatus]
  );

  React.useEffect(
    () => {
      if (isClearTickets) {
        clearSelectedTickets();
        props.setIsClearTickets?.(false);
      }
    },
    [isClearTickets, props],
  );

  const onChangeSeanceTimeClick = (clickedSeance: ScheduleResponse.IGetByNearSeance) => {
    dispatch(getScheduleDetail(clickedSeance.id))
    dispatch(getHallPlan(clickedSeance.id))
    dispatch(getSeatsStatus(clickedSeance.id))
    initHallMap();
  };

  const changeRowAndColCount = (hall: HallMapReducerTypes.IHall) => {
    const hallSeats = hall.zones || [];
    props.setRowColCount({
      rowsCount: hallSeats.length > 0 ? Math.max.apply(Math, hallSeats.map((o: { x: any; }) => o.x)) : 0,
      colsCount: hallSeats.length > 0 ? Math.max.apply(Math, hallSeats.map((o: { y: any; }) => o.y)) : 0,
    });
  };

  const onMainClick = () => {
    navigate('/');
    dispatch(ticketBuy(null))
  }

  const modalClose = () => {
    dispatch(ticketBuy(null))
    if (ticketReserveState?.id) {
      selectedTickets.forEach((n: ITicket) => {
        changeSeatStatus(n.seat, 3);
      });
      setSelectedTickets([]);
      updateGlobalSelectedTickets([]);
      updateGlobalTicketTotalPrice(0);
    }
  }

  const initHallMap = () => {
    if (schedule.seance.id !== 'undefined') {
      dispatch(hallMapActions.getHallPlan(scheduleData.seance.id));
      dispatch(hallMapActions.getSeatsStatus(scheduleData.seance.id));
    }
  };

  const getHallMap = (
    hall: HallMapReducerTypes.IHall,
  ): ISeat[][] => {
    const hallSeats = [].concat(...hall.zones.map((zone: any) => {
      return zone.seats
    })) || [];

    const rowsCount = hallSeats.length > 0 ? Math.max.apply(Math, hallSeats.map((o: { x: any; }) => o.x)) : 0;
    const colsCount = hallSeats.length > 0 ? Math.max.apply(Math, hallSeats.map((o: { y: any; }) => o.y)) : 0;
    const array: ISeat[][] = Array(colsCount).fill(null).map(() => Array(rowsCount).fill({
      seatRow: -1,
      seatCol: -1,
      status: -1,
      rowText: -1,
      colText: -1,
    }));


    hallSeats.forEach((item: HallMapReducerTypes.IHallSeats) => {
      const x = item.x;
      const y = item.y;
      const seatArrayX = hall.isPerformanceAreaBottom ? colsCount - y : y - 1;
      const seatArrayY = hall.isPerformanceAreaBottom ? rowsCount - x : x - 1;
      if (array[seatArrayX]) {
        array[seatArrayX][seatArrayY] = {
          id: item.id,
          seatRow: item.y,
          seatCol: item.x,
          status: hallSeatsStatus?.find((s: HallMapReducerTypes.ISeatStatus) => s.seat_id === item.id)?.status || item.status,
          ticket: hallSeatsStatus?.find((s: HallMapReducerTypes.ISeatStatus) => s.seat_id === item.id)?.ticket || hallSeatsStatus?.find((s: HallMapReducerTypes.ISeatStatus) => s.seat_id === item.id)?.cashier_id,
          rowText: item.rowText,
          colText: item.seatText,
          name: '',
          zoneColor: item.zoneColor,
          zoneId: item.zoneId,
          zoneName: item.zoneName,
          loveSeatReference: item.loveSeatReference
        };
      }
    });

    selectedTickets && array.length > 0 && cookieTickets && cookieTickets.forEach((n: ITicket) => {
      const { seat } = n;
      const row = hall.isPerformanceAreaBottom ? colsCount - seat.seatRow : seat.seatRow - 1;
      const col = hall.isPerformanceAreaBottom ? rowsCount - seat.seatCol : seat.seatCol - 1;
      array[row][col] = {
        ...seat,
        label: n.type,
        status: 2,
      };
    });
    return array;
  };

  // TODO: need to rewrite
  const checkSeatRemovability = (seat: ISeat) => {
    const isPerformanceAreaBottom = hallMap && (hallSeatsStatus === null || hallSeatsStatus) && hallMap.isPerformanceAreaBottom;

    const row = isPerformanceAreaBottom ? props.rowColCount.colsCount - seat.seatRow : seat.seatRow - 1;
    const col = isPerformanceAreaBottom ? props.rowColCount.rowsCount - seat.seatCol : seat.seatCol - 1;

    if (props.seatArray[row]) {
      const prevprevSeat = col - 2 >= 0 ? props.seatArray[row][col - 2] && props.seatArray[row][col - 2].status : -1;
      const prevSeat = col - 1 >= 0 ? props.seatArray[row][col - 1] && props.seatArray[row][col - 1].status : -1;
      const nextSeat = col + 1 < props.rowColCount.rowsCount ? props.seatArray[row][col + 1] && props.seatArray[row][col + 1].status : -1;
      const nextnextSeat = col + 2 < props.rowColCount.rowsCount ? props.seatArray[row][col + 2] && props.seatArray[row][col + 2].status : -1;

      return !(
        prevSeat === 2 && (nextSeat === 3 || nextSeat === 2) && (prevprevSeat !== 3 || nextnextSeat !== 3) ||
        nextSeat === 2 && (prevSeat === 3 || prevSeat === 2) && (nextnextSeat !== 3 || prevprevSeat !== 3)
      );
    }
    return false;
  };

  const onSelectSeat = (seat: ISeat, label: string, name: string, price: number, discountId: string) => {
    const user_id = localStorage.getItem("userID");
    const body = {
      seat: seat,
      cashier_id: user_id,
      label: label,
      name: name,
      price: price,
      discountId: discountId,
      seatArray: props.seatArray
    }

    const newTicket: ITicket = {
      price,
      discountId,
      seat: { ...seat, label, name },
      type: label,
      id: seat.id,
    };

    const updatedSelectedTickets = [...selectedTickets];
    const repeatedItemIndex = updatedSelectedTickets.findIndex((item => item.id === newTicket.id));

    if (repeatedItemIndex !== -1) {
      updatedSelectedTickets[repeatedItemIndex] = newTicket;
    } else {
      updatedSelectedTickets.push(newTicket);
    }

    changeSeatStatus(seat, 2, label);
    setSelectedTickets(updatedSelectedTickets);
    handleTicketPriceSum(updatedSelectedTickets);
    updateGlobalSelectedTickets(updatedSelectedTickets);
    socket && socket.emit('lockSeat', {...body, updatedSelectedTickets: updatedSelectedTickets});
  };

  const changeSeatStatus = (seat: ISeat, status: number, label?: string, seatArray?: any) => {
    const isPerformanceAreaBottom = hallMap && hallSeatsStatus && hallMap.isPerformanceAreaBottom;
    const row = isPerformanceAreaBottom ? props.rowColCount.colsCount - seat.seatRow : seat.seatRow - 1;
    const col = isPerformanceAreaBottom ? props.rowColCount.rowsCount - seat.seatCol : seat.seatCol - 1;

    if (seatArray) {
      seatArray[row][col] = {
        ...seatArray[row][col],
        label,
        status,
      }
    } else {
      props.seatArray[row][col] = {
        ...props.seatArray[row][col],
        label,
        status,
      }
    }

    props.setSeatArray(seatArray || props.seatArray);
  };


  const onRemoveTicketById = (ticketId: string) => {
    const filteredTickets = selectedTickets.filter(item => item.id !== ticketId);
    setSelectedTickets(filteredTickets);
    handleTicketPriceSum(filteredTickets);
    updateGlobalSelectedTickets(filteredTickets);
  };

  const handleTicketPriceSum = (selectedTickets: ITicket[]) => {
    const ticketsSum = selectedTickets.reduce((totalSum, ticket) => totalSum + ticket.price, 0);
    updateGlobalTicketTotalPrice(ticketsSum);
  };

  const updateGlobalSelectedTickets = (tickets: ITicket[]) => {
    Cookies.set('tickets', stringify(tickets));
  };

  const updateGlobalTicketTotalPrice = (totalSum: number) => {
    Cookies.set('ticketsSum', totalSum.toString());
  };

  const clearSelectedTickets = () => {
    let seats = selectedTickets.map(item => item.id);
    const user_id = localStorage.getItem("userID");
    const body = {
      seats: seats,
      cashier_id: user_id
    }
    unlockSeat(body, window.location.pathname.split("/").reverse()[0]).then((res) => {
      if (res.status === 200){
        selectedTickets.forEach((n: ITicket) => {
          changeSeatStatus(n.seat, 1);
        });
        setSelectedTickets([]);
        updateGlobalSelectedTickets([]);
        updateGlobalTicketTotalPrice(0);
        socket.emit('unlockAll', {
          selectedTickets:selectedTickets,
          success:true
        })
      }
    }).catch((res) => {
      socket.emit('unlockAll', {
        error:true
      })
    })
  };

  const initialSlideId = scheduleData?.near_seances?.findIndex((el: any) => el.id === scheduleData.seance.id) || 0;

  const resetHallMap = () => {
    dispatch(hallMapActions.getHallPlan(scheduleData.seance.id));
    dispatch(hallMapActions.getSeatsStatus(scheduleData.seance.id));
  }

  return (
    <>
      <div className="w-100 mt-2 mb-24 d-flex justify-content-center">
        <div style={{ width: '680px' }}>
          {scheduleData?.near_seances && initialSlideId > -1 &&
            <Slider
              className="buttons-slider"
              variableWidth
              arrows
              slidesToShow={7}
              centerMode
              centerPadding={'0px'}
              infinite={scheduleData?.near_seances?.length > 7}
              focusOnSelect={true}
              initialSlide={initialSlideId + 2}
              prevArrow={<button>{`<`}</button>}
              nextArrow={<button>{`>`}</button>}
            >
              {scheduleData.near_seances.map((item: ScheduleResponse.IGetByNearSeance, index: React.Key | null | undefined) => (
                <div className={`${isTimeWillPass(item?.end_time, 0) && "near_seances-notactive"}`}>
                  <button
                    key={index}
                    className={classNames(['slider-btn', item.id === scheduleData.seance.id && 'slider-btn--active'])}
                  >
                    <span
                      className={classNames(['slider-btn__text', item.id === scheduleData.seance.id && 'slider-btn__text--active'])}
                    >
                      {item.id === scheduleData.seance.id && '✓ '}{timeTransform(item.start_time, TEXT_TIME_FORMAT)}
                    </span>
                  </button>
                  <div className="w-100 text-center">
                    <Typography variant="subbodybold" className="color_secondary">
                      {item.hall.name}
                    </Typography>
                  </div>
                </div>
              ))}
            </Slider>
          }
        </div>
      </div>
      <div>
      </div>
      <div className="modal-seats">
        <Divider className="mt-4 mb-4" />
        <div>
          <MultipleSeats
            prices={hallMap?.zones?.map((item: any) => {
              return item?.discounts?.map((discount: any) => {
                return {
                  ...discount,
                  zoneId: item?.id
                }
              })
            }).filter((item: any) => item !== undefined).reduce((all: any, item: any) => {
              return item && all && [...all, ...item]
            }, []) || []}
            selectedDiscount={selectedDiscount}
            selectDiscountHandler={selectDiscountHandler}
          />
        </div>
        <div className={classNames(['d-flex flex-column'])}>
          <div className="modal-seats__hall fill_w">
            <HallMap
              isPerformanceAreaBottom={hallMap && hallMap.isPerformanceAreaBottom}
              // hallMapLoading={hallMapLoading || hallZonesLoading}
              hallMapLoading={hallSeatsStatusLoading}
              seatArray={props.seatArray}
              ticketsCount={selectedTickets.length || 0}
              prices={hallMap?.zones?.map((item: any) => {
                return item?.discounts?.map((discount: any) => {
                  return {
                    ...discount,
                    zoneId: item?.id
                  }
                })
              }).filter((item: any) => item !== undefined).reduce((all: any, item: any) => {
                return item && all && [...all, ...item]
              }, []) || []}
              zones={hallMap?.zones}
              rowCount={props.rowColCount.rowsCount}
              colCount={props.rowColCount.colsCount}
              onSelectSeat={onSelectSeat}
              checkSeatRemovability={checkSeatRemovability}
              onRemoveSeat={props.onRemoveSeat}
              isBasketOpen={props.isBasketOpen}
              resetHallMap={resetHallMap}
              selectedDiscount={selectedDiscount}
            />
          </div>
        </div>
        {firstPopup && (
          <Popup
            title={'Места успешно забронированы'}
            closeBtnType={'red'}
            isCloseBtn={() => modalClose()}
            closePopup={() => onBuyClick()}
          />
        )}
      </div>
    </>
  );
}

export default ModalSeats;
