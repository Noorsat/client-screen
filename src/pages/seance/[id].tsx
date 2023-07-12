import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { useNavigate } from "react-router-dom";
import { ScheduleResponse } from "../../store/schedule/types";
import { getScheduleDetail } from "../../store/schedule/actions";
import {
  TEXT_DATE_WEEKDAY_TIME_FORMAT
} from "../../constants/date";
import { ChangeDay } from "../../store/seance/types";
import ModalSeats from "../../components/ModalSeats";
import Typography from "../../components/Typography";
import { useParams } from 'react-router-dom'
import './index.scss';
import BottomPanel from "../../components/BottomPanel";
import Button from "../../components/Button";
import { dateTransform } from "../../utils/transform";
import { useCallback } from "react";
import ModalOrder from 'src/components/Modal';
import Cookies from "js-cookie";
import { ISeat, ITicket } from "../../core/components/types";
import Image from "../../components/Image";
import ticketEmpty from 'src/assets/images/ticket-empty.png';
import CardTicket from "../../components/CardTicket";
import classNames from "classnames";
import arrowRight from 'src/assets/images/arrow-right.svg';
import { setOpenModal } from 'src/store/modal/modalSlice';
import { FromKeyboard } from "../../components/FormKeyboard";
import 'antd/dist/antd.css';
import { HallMapReducerTypes } from "../../store/hallMap/types";
import { getHallPlan, getPayments, getSeatsStatus } from "../../store/hallMap/actions";
import { stringify } from 'zipson';
import { buyTicket, exportTicket, printTicket, unlockSeat } from 'src/store/ticket';
import moment from 'moment';
import { loadData } from 'src/store/ticket/ticketSlice';
import { LoadingOutlined } from '@ant-design/icons';
import {Spin, notification} from 'antd';
import {Modal} from 'antd';
import * as io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_CUSTOMER_DISPLAY_API || '');

export function Seance() {
  const params = useParams();
  const seanceId = params.id || "";
  const dispatch = useDispatch();
  const scheduleDetail: ScheduleResponse.IGetBy = useSelector(
    (state: RootState) => state.schedulesReducer.scheduleDetail.data,
  );
  const ticketReserveState = useSelector((state: RootState) => state.hallMapReducer.ticketReserveState.data);
  const paymentsState = useSelector((state: RootState) => state.schedulesReducer.scheduleDetail.data?.contract?.payments);
  const hallMap = useSelector((state: RootState) => state.hallMapReducer.halls.data);

  const side = localStorage.getItem('side');

  const [rowColCount, setRowColCount] = React.useState<{ rowsCount: number, colsCount: number }>(
    { rowsCount: 0, colsCount: 0 },
  );
  const [seatArray, setSeatArray] = React.useState<ISeat[][]>([]);
  const isModalOpen = useSelector((state: RootState) => state.modalSlice.isModalOpen);
  const [isMobileView, setIsMobileView] = React.useState<boolean>(false);
  const [isBasketOpen, setIsBasketOpen] = React.useState<boolean>(true);
  const [isClearTickets, setIsClearTickets] = React.useState<boolean>(false);
  const [differenceTime, setDifferenceTime] = React.useState<number>(0);
  const [paymentMethod, setPaymentMethod] = React.useState<any>();

  const cookieTicketsPriceRaw = Cookies.get('ticketsSum');
  const [totalPriceSum, setTotalPriceSum] = React.useState<number>(0);

  const [selectedTickets, setSelectedTickets] = React.useState<ITicket[] | any[]>([]);
  const [firstPopup, setFirstPopup] = React.useState<boolean>(false);
  const [showReserveModal, setShowReserveModal] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);

  const managerName = localStorage.getItem("managerName")
  const pos = localStorage.getItem("pos")

  const navigate = useNavigate();

  React.useEffect(
    () => {
      setIsMobileView(window.innerWidth < 768);
    },
    [],
  );

  React.useEffect(() => {
    socket && socket.on('buyResponse', (data : any) => {
      if (side === "client"){
        if (data.success){
          dispatch(loadData(false))
          setLoading(false)
          selectedTickets.forEach((n: ITicket) => {
            changeSeatStatus(n.seat, 1);
          });
          setSelectedTickets([]);
          updateGlobalSelectedTickets([]);
          updateGlobalTicketTotalPrice(0);
          dispatch(getHallPlan(data?.seanceId))
          dispatch(getSeatsStatus(data?.seanceId))

        }else if (data.error){
 
        }
      }
    })
    socket && socket.on('reserveResponse', (data : any) => {
      if (side === "client"){
        if (data.success){
          setSelectedTickets([]);
          updateGlobalSelectedTickets([]);
          updateGlobalTicketTotalPrice(0);
          dispatch(getHallPlan(data?.seanceId))
          dispatch(getSeatsStatus(data?.seanceId))
        }else if (data.error){

        }
      }
    })
    socket && socket.on('unlockResponse', (data : any) => {
      if (side === "client"){
        console.log(data)
        if (data.success){
          const row = data?.seat.seatRow - 1;
          const col = data?.seat.seatCol - 1;
          let seatArray = data?.seatArray;

          seatArray[row][col] = {
            ...seatArray[row][col],
            status:1 
          }

          setSeatArray(seatArray)

          setSelectedTickets(data?.selectedTickets);
        }else if (data.error){

        }
      }
    })
    socket && socket.on("toMainPageResponse", (data : any) => {
      if (side === "client"){
        navigate('/');
      }
    })
  }, [socket])

  const changeSeatStatus = (seat: ISeat, status: number, seatArr? : any, label?: string) => {
    const isPerformanceAreaBottom = hallMap && hallMap.isPerformanceAreaBottom;
    const row = isPerformanceAreaBottom ? rowColCount.colsCount - seat.seatRow : seat.seatRow - 1;
    const col = isPerformanceAreaBottom ? rowColCount.rowsCount - seat.seatCol : seat.seatCol - 1;

    if (seatArr){
      console.log(seatArr[row][col])
      seatArr[row][col] = {
        ...seatArray[row][col],
        status,
      }
    }else{
      seatArray[row][col] = {
        ...seatArray[row][col],
        label,
        status,
      }
    }

    setSeatArray(seatArr || seatArray);
  };

  const onRemoveSeat = (seat: ISeat) => {
    const user_id = localStorage.getItem("userID");
    const body = {
      seats: [
        seat.id
      ],
      cashier_id: user_id
    }
    unlockSeat(body, window.location.pathname.split("/").reverse()[0]).then((res) => {
      if (res.status === 200){
        changeSeatStatus(seat, 1);
        const filteredTickets = onRemoveTicketById(seat.id);
        socket.emit('unlock', {
          seat:seat,
          selectedTickets: filteredTickets,
          seatArray: seatArray,
          success:true
        })
      }
    }).catch((res) => {
      socket.emit('unlock', {
        error:true
      })
      notification["error"]({
        message: "Не получилось разблокировать место",
        placement: "top"
      })
    })
  };

  const onRemoveTicketById = (ticketId: string) => {
    const filteredTickets = selectedTickets.filter(item => item.id !== ticketId);
    setSelectedTickets(filteredTickets);
    handleTicketPriceSum(filteredTickets);
    updateGlobalSelectedTickets(filteredTickets);
    return filteredTickets;
  };

  const handleTicketPriceSum = (selectedTickets: ITicket[]) => {
    const ticketsSum = selectedTickets.reduce((totalSum, ticket) => totalSum + ticket.price, 0);
    setTotalPriceSum(ticketsSum);
    updateGlobalTicketTotalPrice(ticketsSum);
  };

  const getPrice = () => {
    let total = 0;
    selectedTickets.map((ticket: any) => {
      return total += ticket.price
    });
    return total;
  }

  const updateGlobalSelectedTickets = (tickets: ITicket[]) => {
    Cookies.set('tickets', stringify(tickets));
  };

  const updateGlobalTicketTotalPrice = (totalSum: number) => {
    Cookies.set('ticketsSum', totalSum.toString());
  };


  React.useEffect(() => {
    setPaymentMethod(paymentsState && paymentsState[0].id)
  }, [paymentsState])

  React.useEffect(() => {
    dispatch(getScheduleDetail(seanceId))
  }, [dispatch, seanceId]);


  React.useEffect(
    () => {
      ticketReserveState?.id && setShowReserveModal(false);
    },
    [ticketReserveState],
  );

  function handleChange(e: any) {
    setPaymentMethod(e.target.value);
  }

  const timeToCorrectFormat = (num: number): string => {
    if (num.toString().length < 2) {
      return `0${num}`
    }
    return num.toString();
  }

  const onBuyClick = (id: string) => {
    setLoading(true);
    const data: HallMapReducerTypes.ITicketReserveRequest = {
      seance_id: scheduleDetail?.seance?.id,
      seats: selectedTickets.map((n: ITicket) => {
        return {
          id: n.seat.id,
          discount_id: n.discountId,
          zone_id: n.seat.zoneId
        }
      }),
      contract: {
        id: scheduleDetail.contract.id,
      },
      comment: 'test comment',
      payment: {
        id
      }
    }
    buyTicket(data).then((res) => {
      if (res?.status === 200){
          dispatch(loadData(false))
          setLoading(false)
          selectedTickets.forEach((n: ITicket) => {
            changeSeatStatus(n.seat, 1);
          });
          setSelectedTickets([]);
          updateGlobalSelectedTickets([]);
          updateGlobalTicketTotalPrice(0);
          dispatch(getHallPlan(scheduleDetail.seance.id))
          dispatch(getSeatsStatus(scheduleDetail.seance.id))
          Modal.success({
            title:"Места успешно проданы",
          })
          exportTicket(res?.data?.data?.id)
          socket.emit('buy', {
            seanceId: scheduleDetail.seance.id,
            success:true
          })
      }else{
        setLoading(false);
        Modal.error({
          title: "Ошибка связи с сервером",
          onOk: () => {
            setTimeout(() => {
              dispatch(getHallPlan(scheduleDetail.seance.id))
              dispatch(getSeatsStatus(scheduleDetail.seance.id))
            }, 0)
          }
        })
        socket.emit('buy', {
          error:true
        })
      }
      printTicket(res?.data?.data?.id)
    })
    setFirstPopup(false)
  };


  React.useEffect(() => {
    let total = 0;
    selectedTickets.map((ticket: any) => {
      return total += ticket.price
    });
    setTotalPriceSum(total);
  },
    [selectedTickets],
  );

  React.useEffect(() => {
    if (scheduleDetail?.seance) {
      const todayDate = new Date();
      const seanceDate = new Date(scheduleDetail.seance.start_time);
      // @ts-ignore
      const diffMs = (seanceDate - todayDate);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
      const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
      if (diffDays === 0) {
        setDifferenceTime(diffHrs * 60 * 60 + diffMins * 60);
      }
    }
  }, [scheduleDetail?.seance]);

  React.useEffect(() => {
    if (differenceTime) {
      const timer = setTimeout(() => setDifferenceTime(differenceTime - 1), 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [differenceTime])

  const getLanguage = (lang: any) => {
    switch (lang) {
      case "rus": return "Русский"
        break;
      case "eng": return "English"
        break;
      case "kaz": return "Қазақша"
        break;
      default: return ""
        break;
    }
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 64, color: "#C31D28" }} />;

  return (
    <div>
    <div className="d-flex width-limit">
      {
        loading &&
        <div className='spin'>
          <Spin size='large' indicator={antIcon} />
        </div>
      }
      <div className={classNames('p-8 left-container flex-shrink-0', isBasketOpen && 'left-container--mini', side === "client" && 'client')}>
        <div className="d-flex justify-content-between top-content mx-16">
          <div>
            <Typography
              variant="h2"
            >
              {scheduleDetail && `${scheduleDetail?.name}, ${scheduleDetail?.certification}`}
            </Typography>
            <div className="d-flex">
              <Typography variant="bodybold">
                {scheduleDetail?.seance && `${scheduleDetail.seance.hall.name}, язык: ${getLanguage(scheduleDetail.seance.language)}`}
              </Typography>
            </div>
            <div className="d-flex">
              <Typography
                variant="bodybold"
                className=""
              >
                {
                  scheduleDetail?.seance &&
                  scheduleDetail?.seance.start_time &&
                  dateTransform(scheduleDetail?.seance.start_time, TEXT_DATE_WEEKDAY_TIME_FORMAT).charAt(0).toUpperCase() +
                  dateTransform(scheduleDetail?.seance.start_time, TEXT_DATE_WEEKDAY_TIME_FORMAT).slice(1) + " - " + moment(scheduleDetail?.seance?.end_time).format("HH:mm")
                }
              </Typography>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end pt-16 top-time flex-shrink-0">
            {
              side === "cashier" && (
                <div style={{fontSize:12}}>
                Кассир: {managerName}
                <br>
                </br>
                POS: {pos}
              </div>
              )
            }
              {differenceTime > 0 &&
              <span>До начала сеанса: <b>
                {differenceTime / 60 / 60 > 0 ?
                  `${timeToCorrectFormat(Math.floor(differenceTime / 3600))}:${timeToCorrectFormat(Math.floor((differenceTime / 60) % 60))}:${timeToCorrectFormat(differenceTime % 60)}` :
                  `${timeToCorrectFormat(Math.floor((differenceTime / 60) % 60))}:${timeToCorrectFormat(differenceTime % 60)}`
                }
              </b></span>
              }
            </div>
        </div>
        {scheduleDetail && (
          <ModalSeats
            step={1}
            isMobileView={isMobileView}
            schedule={scheduleDetail || {} as ScheduleResponse.IGetBy}
            scheduleLoading={false}
            day={ChangeDay.Today}
            cookieTickets={selectedTickets || []}
            selectedTickets={selectedTickets}
            setSelectedTickets={setSelectedTickets}
            isClearTickets={isClearTickets}
            setIsClearTickets={setIsClearTickets}
            isBasketOpen={isBasketOpen}
            firstPopup={firstPopup}
            setFirstPopup={setFirstPopup}
            onRemoveSeat={onRemoveSeat}
            rowColCount={rowColCount}
            setRowColCount={setRowColCount}
            seatArray={seatArray}
            setSeatArray={setSeatArray}
            onBuyClick={onBuyClick}
          />
        )}

        {isModalOpen && <ModalOrder show={isModalOpen} onHide={() => dispatch(setOpenModal(false))} />}
        {
          side === "cashier" ? <BottomPanel isBasketOpen={isBasketOpen} discounts={scheduleDetail?.seance?.discounts} selectedTickets={selectedTickets} /> : (
            <div className='tickets'>
              <div className='tickets__items'>
                {
                  selectedTickets?.map(ticket => (
                    <div className='tickets__item'>
                      {ticket?.seat?.rowText} ряд, {ticket?.seat?.colText} место ({ticket?.seat?.name}) - {ticket?.price} тг
                    </div>
                  ))
                }
              </div>
              <div className='tickets__overall'>
                <div>
                  Количество билетов: {selectedTickets.length}
                </div>
                <div>
                  Общая цена: {getPrice()}
                </div>
              </div>
            </div>
          )
        }
      </div>
      {
        side === "cashier" && (
      <div
        className={classNames(
          'right-basket flex-shrink-0 d-flex flex-column',
          isBasketOpen && 'right-basket--visible',
        )}
      >
        {/* <div className="d-flex w-100 justify-content-center right-basket__title">
          <Typography variant="h3">
            Билеты {selectedTickets.length > 0 && selectedTickets.length}
          </Typography>
        </div> */}
        { selectedTickets.length > 0 ? (
          <div className="right-basket__content d-flex flex-column justify-content-between">
            <div className="">
              <div className="d-flex flex-column mt-16">
                <div className="d-flex justify-content-between mt-16">
                  <div>
                    <Typography
                      variant="bodybold"
                      className=""
                    >
                      {
                        moment(new Date()).format("YYYY.MM.DD")
                      }
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="bodybold"
                      className=""
                    >
                      {
                        moment(new Date()).format("HH:mm")
                      }
                    </Typography>
                  </div>
                </div>
                {/* <div>
                <Typography
                  variant="h3"
                  className=""
                >
                  Способ оплаты
                </Typography>
                <select
                  className="mt-8"
                  defaultValue={'cash'}
                  style={{ width: '100%', height: 40 }}
                  onChange={handleChange}
                >
                  {paymentsState?.map((n: any, index: number) => (
                    <option key={index} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div> */}
                <div className='total__sum d-flex justify-content-between' style={{ fontSize: 20, borderBottom: '1px solid lightgrey' }}>
                  <div>
                    Билеты:
                  </div>
                  <div>
                    {selectedTickets.length} шт
                  </div>
                </div>
                <div className='total__sum d-flex justify-content-between'>
                  <div>
                    Итого:
                  </div>
                  <div>
                    {getPrice()} ₸
                  </div>
                </div>
                <div className='d-flex gap-1 mt-3'>
                  {
                    paymentsState.map((payment: any) => (
                      <Button
                        variant="bodybold"
                        color={payment.type === 1 ? "red" : "black"}
                        className="w-50 py-20"
                        style={{ borderRadius: '6px' }}
                        onClick={() => onBuyClick(payment.id)}
                        disabled={loading}
                      >
                        {payment.name.split(" ")[0]}<br></br>{payment.name.split(" ")[1]}
                      </Button>
                    ))
                  }
                </div>
                {/* <div>
                 {getPrice()} ₸
                </div> */}
              </div>
              {/* <div className='d-flex gap-1 mt-3'>
                {
                  paymentsState?.map((payment : any) => (
                    <Button
                      variant="bodybold"
                      color={payment.type === 1 ? "red" : "black"}
                      className="w-50 py-20"
                      style={{ borderRadius: '6px' }}
                      onClick={() => onBuyClick(payment.id)}
                      disabled={loading}
                    >
                      {payment.name.split(" ")[0]}<br></br>{payment.name.split(" ")[1]}
                  </Button>
                  ))
                }
              </div> */}
              <div className="mt-8">
                {/* <Button
                  variant="bodybold"
                  color="red"
                  className="w-100 py-10"
                  style={{ borderRadius: '6px' }}
                  onClick={onBuyClick}
                  disabled={loading}
                >
                  Провести оплату ({totalPriceSum} ₸)
                </Button> */}
                  <Button
                    variant="bodybold"
                    type="transparent"
                    className="w-100 py-10 mt-8"
                    style={{ borderRadius: '6px', borderWidth: '2px' }}
                    onClick={() => setShowReserveModal(true)}
                  >
                    Забронировать
                  </Button>
                  <Button
                    variant="bodybold"
                    type="secondary"
                    className="w-100 py-8 mt-8"
                    style={{ border: "none" }}
                    onClick={() => setIsClearTickets(true)}
                  >
                    Очистить
                  </Button>
                </div>
              </div>
              {/* <Typography
                variant="h3"
                className=""
              >
                {scheduleDetail?.name}
              </Typography> */}
              {/* <div className="d-flex mt-8 mb-8">
                {scheduleDetail.genre && scheduleDetail.genre.length > 0 ? scheduleDetail.genre.map((g: string, i: number) => (
                  <Typography
                    key={i}
                    className="color_secondary p-0 mr-4"
                    variant="bodybold"
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                    {scheduleDetail.genre && i === scheduleDetail.genre.length - 1 ? '' : ','}
                  </Typography>
                ),
                ) : (
                  <Typography
                    variant="bodybold"
                    className="color_secondary"
                  >
                    драма, мюзикл
                  </Typography>
                )}
                <div className="basket-item__age">
                  <div className="basket-item__age-text">
                    {scheduleDetail?.certification || '6+'}
                  </div>
                </div>
              </div> */}
              {/* <div className="d-flex align-items-center">
                <Typography
                  variant="subbody"
                  className="color_secondary"
                >
                  Продолжительность:
                </Typography>
                {scheduleDetail?.duration && (
                  <Typography
                    variant="body"
                    className="ml-8"
                  >
                    {scheduleDetail?.duration} минут
                  </Typography>
                )}
              </div> */}

              <div className="mt-16">
                {selectedTickets.map((n, index) => (
                  <CardTicket
                    key={index}
                    ticket={n}
                    onRemoveTicket={onRemoveSeat}
                    selectedTickets={selectedTickets}
                  />
                ))}
              </div>
            </div>
        ) : (
          <div className="w-100 right-basket__empty-content d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex flex-column">
              <Image
                src={ticketEmpty}
                alt=""
                className="mb-24"
              />
              <Typography
                variant="h3"
                className="color_secondary"
              >
                Здесь пока пусто
              </Typography>
            </div>
          </div>
        )}
      </div>
      )
    }
    {
      side === "cashier" && (
        <Button
        variant="bodybold"
        color="red"
        className="basket-btn d-flex justify-content-center align-items-center"
        onClick={() => setIsBasketOpen(!isBasketOpen)}
      >
        <img
          className={classNames('basket-btn__img', !isBasketOpen && 'basket-btn__img--rotate')}
          src={arrowRight}
          alt='arrow right'
        />
      </Button>
      )
    }
      
      {showReserveModal &&
        <FromKeyboard seanceId={seanceId || ''} selectedTickets={selectedTickets} onCloseModal={() => setShowReserveModal(false)} setSelectedTickets={setSelectedTickets} />
      }

    </div>
    </div>
  );
};
