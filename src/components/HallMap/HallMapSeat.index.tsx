import * as React from 'react';
import classNames from 'classnames';
import { isSeatLoveSeats1, isSeatLoveSeats2, isSeatVIP, isSeatWheelchair } from 'src/utils/validation';
import { removeLettersFromSeat } from 'src/utils/serialization';
import Hint from 'src/components/Hint';
import Typography from 'src/components/Typography';
import SchedulePriceHint from 'src/components/SectionSchedule/SchedulePriceHint.index';
import { HallMapSeatTypes, seatStatuses } from 'src/components/HallMap/types';
import { ISeat } from 'src/core/components/types';
import { ScheduleTypes } from 'src/store/schedule/types';
import iconWheelchair from 'src/assets/images/wheelchair.svg';
import Image from 'src/components/Image';
import './index.scss';
import ScheduleBookedHint from "../SectionSchedule/ScheduleBookedHint.index";
import ScheduleReservedHint from "../SectionSchedule/ScheduleReservedHint.index";
import { lockSeat, unlockSeat } from 'src/store/ticket';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getHallPlan, getSeatsStatus } from 'src/store/hallMap/actions';
import { consoleSandbox } from '@sentry/utils';


class HallMapSeat extends React.Component<HallMapSeatTypes.IProps, HallMapSeatTypes.IState> {
  
  constructor(props: HallMapSeatTypes.IProps) {
    super(props);
    this.state = {
      isOpened: false,
      isModalVisible: false
    };
  }

  public onSelectSeat = (seat: ISeat) => (label: string, discount: ScheduleTypes.IDiscountInfo) => {
    const user_id = localStorage.getItem("userID");
    const body = {
      seats: [
        seat.id
      ],
      cashier_id: user_id
    }

    lockSeat(body, window.location.pathname.split("/").reverse()[0]).then((res) => {
      if (res?.status === 200){
        this.props.onSelectSeat && this.props.onSelectSeat(seat, discount, label);
      }else{
        this.setState({ ...this.state, isModalVisible: true })
      }
    })
  }

  public onSelectMultipleSeat = (seat: ISeat) => {
    const user_id = localStorage.getItem("userID");
    const body = {
      seats: [
        seat.id
      ],
      cashier_id: user_id
    }

    let discountName = this.props.prices.filter(price => price.id === this.props.selectedDiscount)[0]?.name
    if (discountName){
      let discount =  this.props.prices.filter(price => price?.zoneId === seat?.zoneId).filter(price => price?.name === discountName)[0]
      if (discount){
      lockSeat(body, window.location.pathname.split("/").reverse()[0]).then((res) => {
        if (res?.status === 200){
          this.props.onSelectSeat && this.props.onSelectSeat(seat, discount, "");
        }else{
          this.setState({ ...this.state, isModalVisible: true })
        }
      })
      }
    }
  }

  public onRemoveSeat = (seat: ISeat) => () => {
    this.props.onRemoveSeat && this.props.onRemoveSeat(seat);
    const user_id = localStorage.getItem("userID");
    const body = {
      seats: [
        seat.id
      ],
      cashier_id: user_id
    }
    unlockSeat(body, window.location.pathname.split("/").reverse()[0])
  }

  public handleSeatClassnames = (seat: ISeat, selected?: boolean) => {
    return classNames(
      this.props.isZoomClicked ? 'hall-map__table__cell' : 'hall-map__table__cell-little',
      this.props.isBasketOpen && "active",
      {
        'hall-map__table__cell--wheelchair': isSeatWheelchair(seat),
        'hall-map__table__cell--wheelchair--selected': isSeatWheelchair(seat) && selected,
        'hall-map__table__cell--love-seats':  isSeatLoveSeats1(seat),
        'hall-map__table__cell--love-seats1': isSeatLoveSeats1(seat) && seat?.loveSeatReference,
        'hall-map__table__cell--love-seats--selected': (isSeatLoveSeats1(seat) || isSeatLoveSeats2(seat)) && selected,
        'hall-map__table__cell--love-seats2': isSeatLoveSeats2(seat) && seat?.loveSeatReference !== undefined,
        'hall-map__table__cell--vip': isSeatVIP(seat),
        'hall-map__table__cell--vip--selected': isSeatVIP(seat) && selected,
        'hall-map__table__cell--opened': this.state.isOpened,
      });
  }


  public handleSeatTypes = (seat: ISeat) => (
    isSeatWheelchair(seat) ?
        <div className="d-flex fill" style={{borderBottom: '1px solid #C31D28'}}>
        <Image
          src={iconWheelchair}
          alt="wheelchair"
          className="m-auto hall-map__table__cell--wheelchair__i"
        />
      </div> :
      <div className={`hall-map__table__cell__inner ${this.props.isBasketOpen && "active"}`} ><Typography
        className="color_white"
        variant="captionbold"
      >
        {removeLettersFromSeat(seat.colText)}
      </Typography></div>
  )


  public checkTickets(seat: ISeat) {
    const { prices, selectable, ticketsCount, selectedDiscount } = this.props;


    const selectTippy = (bool: boolean) => {
      this.setState({ isOpened: bool });
    }
    return selectable && selectedDiscount === 0 ?
      <Hint
        showOnClick
        theme={'white'}
        
        hint={
          // <SchedulePriceHint
          //   selectable
          //   seat={seat}
          //   prices={prices.filter((item) => item.zoneId === seat?.zoneId)}
          //   onTicketSelect={this.onSelectSeat(seat)}
          // />
          <></>
        }
        onSelectTippy={selectTippy}
      >
        {this.handleSeatTypes(seat)}
      </Hint> :
      selectable && selectedDiscount !== 0 ?
      <div>
        {this.handleSeatTypes(seat)}
      </div>
      :
      <Hint
        showOnClick
        theme={'white'}
        hint={
          <Typography
            variant="subbody"
            className="text-left my-8 mx-12"
          >
            Пожалуйста, не оставляйте
            <Typography
              variant="subbody"
              className="color_red ml-4"
            >
              незанятое место
            </Typography>
            , если есть альтернативные места в том же ряду.
          </Typography>
        }
      >
        {this.handleSeatTypes(seat)}
      </Hint>;
  }

  render() {
    const { seat, prices, removable, isBasketOpen, zones } = this.props;

    if (seat.status === seatStatuses.Free) {
      return <td className={classNames(this.handleSeatClassnames(seat))} style={{background: seat?.zoneColor, color:"#fff", }}>
        <Modal visible={this.state.isModalVisible} footer={[
          <Button key="back" onClick={this.props.resetHallMap}>
            Ok
          </Button>
        ]}>
          <p>Другой кассир выбирает это место!</p>
        </Modal>
        {this.checkTickets(seat)}
      </td>;

    }
    if (seat.status === seatStatuses.Selected) {
      // if (seat.status === seatStatuses.Reserved) {
      const user_id = localStorage.getItem("userID");
      return <td className={classNames('hall-map__table__cell--selected', this.handleSeatClassnames(seat, true), (seat.ticket !== user_id && seat.ticket) && "hall-map__table__cell--selected-another")}>
        <Modal visible={this.state.isModalVisible} footer={[
          <Button key="back" onClick={this.props.resetHallMap}>
            Ok
          </Button>
        ]}>
          <p>Другой кассир выбирает это место!</p>
        </Modal>
        <Hint
          showOnClick
          theme={'white'}
          hint={
            // <SchedulePriceHint
            //   selectable
            //   removable={removable}
            //   selected={seat.label}
            //   seat={seat}
            //   prices={prices.filter((item) => item.zoneId === seat?.zoneId)}
            //   onTicketSelect={this.onSelectSeat(seat)}
            //   onTicketRemove={this.onRemoveSeat(seat)}
            //   selectedDiscount={this.props.selectedDiscount}
            // />
            <></>
          }
        >
          <Typography
            className="color_white"
            variant="captionbold"
          >
            {removeLettersFromSeat(seat.colText)}
          </Typography>
        </Hint>
      </td>;
    }
    if (seat.status === seatStatuses.Reserved) {
      // if (seat.status === seatStatuses.Selected) {
      return <td className={classNames('hall-map__table__cell--reserved', this.handleSeatClassnames(seat, true))}>
        <Modal visible={this.state.isModalVisible} footer={[
          <Button key="back" onClick={this.props.resetHallMap}>
            Ok
          </Button>
        ]}>
          <p>Другой кассир выбирает это место!</p>
        </Modal>
        <Hint
          showOnClick
          theme={'white'}
          hint={
            <ScheduleReservedHint
              seat={seat}
              selectable
              removable={removable}
              selected={seat.label}
              prices={prices.filter((item) => item.zoneId === seat?.zoneId)}
              onTicketSelect={this.onSelectSeat(seat)}
              onTicketRemove={() => this.props.onRemoveSeat && this.props.onRemoveSeat(seat)}
            />
          }
        >
          <Typography
            className="color_white"
            variant="captionbold"
          >
            {removeLettersFromSeat(seat.colText)}
          </Typography>
        </Hint>
      </td>;
    }
    if (seat.status === seatStatuses.Empty) {
      return <td className={classNames(
        'hall-map__table__cell--empty',
        this.props.isZoomClicked ? 'hall-map__table__cell' : 'hall-map__table__cell-little',
        this.props.isBasketOpen && 'active',
      )} />;
    }
    if (seat.status === seatStatuses.FreeReserverd){
        return <td className={classNames('hall-map__table__cell--booked', this.handleSeatClassnames(seat))} style={{borderBottom: seat?.ticket?.contract?.color ? `2px solid ${seat?.ticket?.contract?.color}` : "2px solid #C31D28"}}>
      <Hint
        showOnClick
        theme={'white'}
        hint={
          <ScheduleBookedHint
            seat={seat}
            selectable
            removable={removable}
            selected={seat.label}
            prices={prices.filter((item) => item.zoneId === seat?.zoneId)}
            onTicketSelect={this.onSelectSeat(seat)}
            onTicketRemove={this.onRemoveSeat(seat)}
          />
        }
      >
        {this.handleSeatTypes(seat)}
      </Hint>
      <Modal visible={this.state.isModalVisible} footer={[
        <Button key="back" onClick={this.props.resetHallMap}>
          Ok
        </Button>
      ]}>
        <p>Другой кассир выбирает это место!</p>
      </Modal>
      </td>;
    }
    return <td className={classNames('hall-map__table__cell--booked', this.handleSeatClassnames(seat))} style={{borderBottom: seat?.ticket?.contract?.color ? `2px solid ${seat?.ticket?.contract?.color}` : "2px solid #C31D28"}}>
      <Hint
        showOnClick
        theme={'white'}
        hint={
          <ScheduleBookedHint
            seat={seat}
            selectable
            removable={removable}
            selected={seat.label}
            prices={prices.filter((item) => item.zoneId === seat?.zoneId)}
            onTicketSelect={this.onSelectSeat(seat)}
            onTicketRemove={this.onRemoveSeat(seat)}
          />
        }
      >
        {this.handleSeatTypes(seat)}
      </Hint>
      <Modal visible={this.state.isModalVisible} footer={[
        <Button key="back" onClick={this.props.resetHallMap}>
          Ok
        </Button>
      ]}>
        <p>Другой кассир выбирает это место!</p>
      </Modal>
    </td>;
  }
}

export default HallMapSeat;
