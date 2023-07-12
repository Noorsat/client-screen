import { useEffect, useState } from 'react';
import { Select, Checkbox } from 'antd';
import Typography from "../../components/Typography";
import moment from 'moment';
import { ReservationType } from 'src/store/ticket/types';
import 'antd/dist/antd.css';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setUpdateSeats, setSelectedPayment, saveSelectedSeats } from 'src/store/ticket/ticketSlice';
import { RootState } from "../../store/rootReducer";
import { IoRemoveCircleSharp } from 'react-icons/io5'
import { BsArrowReturnRight } from 'react-icons/bs';
import {Modal} from 'antd';

type Props = {
  detail: ReservationType;
}

type SeatsSelectedType = {
  id: string;
  discount_id: string;
}

type SeatsType = {
  id: string;
  discount_id: string;
  price: number;
  seat: string;
  row: string
}

const { Option } = Select;

export default function ReservationDetail(props: Props) {

  const { detail } = props;

  const {confirm} = Modal;

  const [selectedSeats, setSelectedSeats] = useState<SeatsSelectedType[]>([]);
  const paymentsState = useSelector((state: RootState) => state.hallMapReducer.payments.data);

  const [seats, setSeats] = useState<SeatsType[]>(detail.seats || []);
  const [payment, selectedPayment] = useState(detail.payment ? detail.payment.id : paymentsState && paymentsState[0].id);

  const dispatch = useDispatch();

  let sum = 0;

  for (let i = 0; i < seats?.length; i++) {
    sum += seats[i]?.price;
  }

  useEffect(() => {
    setSeats(detail.seats)
  }, [detail])

  useEffect(() => {
    dispatch(setUpdateSeats(seats));
  }, [dispatch, seats])

  useEffect(() => {
    dispatch(saveSelectedSeats(selectedSeats));
  }, [dispatch, selectedSeats])

  useEffect(() => {
    dispatch(setSelectedPayment(payment));
  }, [dispatch, payment])

  const onSelectPayment = (value: string) => {
    // dispatch(setSelectedPayment(value));
    selectedPayment(value);
  }

  const selectSeat = (seat: any, event: any) => {
    setSelectedSeats((prev) => event.target.checked ? [...prev, seat] : prev.filter(val => val.id !== seat.id));
  }

  const checkAll = (e: any) => {
    if (e.target.checked) {
      setSelectedSeats(seats);
    } else {
      setSelectedSeats([]);
    }
  }

  const onChangeDiscount = (seatId: string, discountId: string) => {
    confirm({
      title: 'Тариф билета изменен. Продолжить продажу?',
      icon:false,
      zIndex:100000000000000,
      okText:"Да, провести оплату",
      cancelText:"Нет, вернуться к редактированию заказа",
      onOk() {
        const selectedDiscount = detail.discounts.filter((discount) => discount.id === discountId);
        const newSeats = seats.map((seat) => seat.id === seatId ? ({ ...seat, discount_id: discountId, price: selectedDiscount[0].price }) : seat);
    
        setSeats(newSeats);
    
        setSelectedSeats([]);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
   
  }

  const removeSeat = (seatId: string) => {
    const newSeats = seats.filter((seat) => seat.id !== seatId);

    setSeats(newSeats);
  }

  const getTicketStatus = (status : string | number) => {
    switch (status){
      case 1: return "Не оплачен"
      break;
      case 2: return "Оплачен"
      break;
      case 4: return "Произведен возврат"
      default: return ""
    }
  }

  return (
    <div className="order-details">
      <div className="order-details-header">
        <div className="order-detail-info">
          <div>
            <strong>#{detail.number} {moment(detail.created_at).format("DD-MM-YYYY")} </strong>
          </div>
          <div className="kassir-info">
            <span>Статус: {getTicketStatus(detail.status)}</span>
          </div>
        </div>
      </div>

      <div className="movie-detail">
        <strong>Фильм: </strong>
        <span>{detail.movie}</span>
      </div>

      <div className="movie-detail">
        <strong>Дата и время: </strong>
        <span>{moment(detail.seance_date).format("DD-MM-YYYY HH:mm:ss")}</span>
        <strong className="hall_name">{detail.hall}</strong>
      </div>

      <div className="movie-detail">
        <strong>Места</strong>
        <div>
          <Checkbox className="checkbox-red" onChange={checkAll} checked={selectedSeats?.length === seats?.length} >
            Все
          </Checkbox>
        </div>
    

        {seats && seats.map((seat) => (
          <div className="seats-block d-flex align-items-center" key={seat.id} id="seats">
            <Checkbox
              className="checkbox-red"
              onChange={(e) => selectSeat(seat, e)}
              checked={selectedSeats.some(val => val.id === seat.id)}
            >
              {`Ряд ${seat.row} место ${seat.seat}`}
            </Checkbox>

            <Select
              defaultValue={seat.discount_id}
              onChange={(e) => onChangeDiscount(seat.id, e)}
              getPopupContainer={() => document.getElementById('seats') as HTMLElement}
              style={{ width: 120 }}
              bordered={false}
              disabled={detail.status === 4 || detail.status === 2 ? true : false}
            >
              {detail.discounts && detail.discounts.map((discount) => (
                <Option disa value={discount.id}>{discount.name}</Option>
              ))}
            </Select>

            <span>{seat.price}</span>
            <span className="remove-seat" onClick={() => removeSeat(seat.id)}><IoRemoveCircleSharp /></span>
          </div>
        ))}
      </div>
      <div className="payment-type">
        <Typography
          variant="h3"
        >
          Способ оплаты
        </Typography>
        {paymentsState && (
          <div id="area" style={{ marginTop: "8px" }}>
            <Select
              defaultValue={payment}
              style={{ width: 250 }}
              onChange={(e) => onSelectPayment(e)}
              getPopupContainer={() => document.getElementById('area') as HTMLElement}>
              {paymentsState?.map((item: any) => (
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="total-sum">
        <span>Итого</span>
        <p>К оплате <span className="sum">{sum}</span></p>
      </div>
    </div>
  )
}