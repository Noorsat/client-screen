import * as React from 'react';
import classNames from 'classnames';
import Typography from 'src/components/Typography';
import Button from 'src/components/Button';
import { SchedulePriceHintTypes } from 'src/components/SectionSchedule/types';
import './index.scss';
import { setOpenModal, setNumberReserve } from 'src/store/modal/modalSlice';
import { useDispatch } from "react-redux";
import { updateTicket } from 'src/store/ticket';
import { getHallPlan, getSeatsStatus } from 'src/store/hallMap/actions';
import crossIcon from 'src/assets/images/cross.svg';
import { Modal } from 'antd';
import { searchMinusImg } from '../HallMap/types';
import { ISeat } from 'src/core/components/types';

function ScheduleReservedHint(props: SchedulePriceHintTypes.IProps) {
  const { seat, onTicketRemove } = props;
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const onPriceEditClick = () => {
    if (seat?.ticket.number) {
      dispatch(setOpenModal(true));

      dispatch(setNumberReserve(seat.ticket.number));
    }
  };


  const ticketCancelHandler = () => {
    setOpen(true);
  }

  const onOk = () => {
    updateTicket(seat?.ticket?.id, seat.ticket?.seats.map((seat : ISeat) => ({...seat, zone_id: props?.seat?.zoneId}))).then((res) => {
      if (res?.status < 400){
        dispatch(getHallPlan(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]))
        dispatch(getSeatsStatus(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]))
        setOpen(false);
        Modal.success({
          title: "Возврат успешно совершен",
          onOk() {},
        })
      }
    })
  }

  const onCancel = () => {
    setOpen(false)
  }

  return (
    <div className={
      classNames(
        'price-hint',
      )}
      style={{background:"#C31D28"}}
      >
         <Modal
            title="Снятие бронирование"
            visible={open}
            footer={[
              <Button onClick={onCancel} color="black" className='me-3'>
                Нет, сохранить бронь
              </Button>,
              <Button onClick={onOk} color="red"> 
                Да, отменить бронь
            </Button>
            ]}
          >
            <p>Бронирование будет отменено</p>
          </Modal>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
          <Typography
        variant="subbody"
        className="d-block text-left ms-3 pt-2"
        style={{color:"white", fontWeight:700, fontSize:16}}
      >
        {seat?.rowText} ряд {seat?.colText} место
        </Typography>
      <Typography
        variant="subbody"
        className="d-block text-left ms-3"
        style={{color:"white"}}
      >
        Кассир: {seat?.ticket?.cashier?.name}
      </Typography>
          </div>
          <div>
          <div className="d-flex justify-content-center align-items-center me-2" style={{ background: '#FFFFFF', width: '20px', height: '20px', borderRadius: '50%' }}>
              <img width={'16px'} height={'16px'} src={crossIcon} alt="cross" />
            </div>
          </div>
        </div>
   
      <div className="d-flex flex-column">
        <Button
          onClick={ticketCancelHandler}
          classNames={['price-hint__btn fill_w color_gray__bg color_black mt-2']}
          style={{borderRadius:0}}
        >
          <Typography
            variant="body"
          >
            Снять бронь
          </Typography>
        </Button>
        <Button
          onClick={onPriceEditClick}
          classNames={['price-hint__btn fill_w color_gray__bg color_black']}
          style={{borderTop:"0.5px solid #A3A7B0", borderRadius:0, borderBottomLeftRadius:8, borderBottomRightRadius:8}}
        >
          <Typography
            variant="body"
          >
            Редактировать
            </Typography>
        </Button>
      </div>
    </div>
  );
}

export default ScheduleReservedHint;
