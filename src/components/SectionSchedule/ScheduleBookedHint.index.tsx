import * as React from 'react';
import classNames from 'classnames';
import Typography from 'src/components/Typography';
import Button from 'src/components/Button';
import { SchedulePriceHintTypes } from 'src/components/SectionSchedule/types';
import './index.scss';
import { message, notification } from 'antd';
import { exportTicket, getReservationDetail, printTicket, updateTicket } from 'src/store/ticket/index';
import { useDispatch, useSelector } from 'react-redux';
import { loadData, setSelectedTicket } from 'src/store/ticket/ticketSlice';
import { getHallPlan, getSeatsStatus } from 'src/store/hallMap/actions';
import crossIcon from 'src/assets/images/cross.svg';
import { Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ISeat } from 'src/core/components/types';
import ModalOrder from '../Modal';
import { setOpenModal } from 'src/store/modal/modalSlice';
import { RootState } from 'src/store';
import * as io from "socket.io-client";
const socket = io.connect('192.168.70.150:3000');

function ScheduleBookedHint(props: SchedulePriceHintTypes.IProps) {
  const side = localStorage.getItem("side")

  const onPrintClick = () => {
    setLoading(true)
    exportTicket(seat?.ticket?.id).then((res) => {
      setLoading(false)
      if (res.status === 200){
        Modal.success(({
          title: "Печать билета успешно пройден",
          onOk: () => {
            dispatch(getHallPlan(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]))
            dispatch(getSeatsStatus(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]))
          }
        }))
      }else{
        Modal.error(({
          title: "Ошибка связи с сервером",
          onOk: () => {
            dispatch(getHallPlan(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]))
            dispatch(getSeatsStatus(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]))
          }
        }))
      }
    })
    printTicket(seat?.ticket?.id)
  };

  React.useEffect(() => {
    socket && socket.on('returnTicketResponse', (data : any) => {
      if (side === "client"){
        if (data.success){
          // notification.success({
          //   message: "Возврат успешно совершен",
          //   placement: 'top'
          // })
          dispatch(loadData(false))
          setOpen(false)
          dispatch(getHallPlan(data?.id))
          dispatch(getSeatsStatus(data?.id))
        }else if (data.error){
        }
      }
    })
  }, [socket])

  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const isModalOpen = useSelector((state: RootState) => state.modalSlice.isModalOpen);

  const dispatch = useDispatch();

  const onPriceRemoveClick = () => {
    setOpen(true);
    dispatch(setSelectedTicket(seat?.ticket?.id))
  }

  const onOk = () => {
    getReservationDetail(seat?.ticket?.id || "").then((response) => {
      updateTicket(seat?.ticket?.id || "", response.data.seats.map((seat: ISeat) => ({ ...seat, zone_id: props?.seat?.zoneId }))).then((res) => {
        if (res?.status < 400) {
          dispatch(loadData(false))
          // message.success({
          //   content: "Данные обновились",
          //   getContainer: () => document.getElementById('calendar') as HTMLElement,
          // })
          Modal.success({
            title: "Возврат успешно совершен",
            onOk() { },
          })
          setOpen(false)
          dispatch(getHallPlan(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]))
          dispatch(getSeatsStatus(window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]))
          socket.emit('returnTicket', {
            id: window.location.pathname.split("/")[window.location.pathname.split("/").length-1],
            success: true 
          })     
        } else {
          Modal.error({
            title: "Ошибка"
          })
          dispatch(getHallPlan(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]))
          dispatch(getSeatsStatus(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]))
          socket.emit('returnTicket', {
            error: true 
          })   
      }
      })
    })
  }

  const onCancel = () => {
    setOpen(false)
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 64, color: "#C31D28" }} />;

  const { seat } = props;

  return (
    <div className={
      classNames(
        'price-hint',
      )}
      style={{ background: "#C31D28" }}
    >
      <Modal
        title="Возврат билета"
        visible={open}
        onCancel={onCancel}
        footer={[
          <Button onClick={() => dispatch(setOpenModal(true))} color="black" className='me-3'>
            Сделать частичный возврат
          </Button>,
          <Button onClick={onCancel} color="black" className='mb-3'>
            Нет, сохранить заказ
          </Button>,
          <Button onClick={onOk} color="red">
            Да, сделать полный возврат
          </Button>
        ]}
      >
        <p>Бронирование будет отменено</p>
      </Modal>
      <Modal
        visible={loading}
        footer={[]}
        closeIcon={false}
        className="export-modal"
      >
        <Spin size='large' indicator={antIcon} />
      </Modal>
      {isModalOpen && <ModalOrder show={isModalOpen} onHide={() => dispatch(setOpenModal(false))} />}
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          <Typography
            variant="subbody"
            className="d-block text-left ms-3 pt-2"
            style={{ color: "white", fontWeight: 700, fontSize: 16 }}
          >
            {seat?.rowText} ряд {seat?.colText} место
          </Typography>
          <Typography
            variant="subbody"
            className="d-block text-left ms-3"
            style={{ color: 'white' }}
          >
            № {seat?.ticket?.number}
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
          onClick={onPrintClick}
          classNames={['price-hint__btn fill_w color_gray__bg color_black mt-2']}
          style={{ borderRadius: 0 }}
        >
          <Typography
            variant="body"
          >
            Печать билета
          </Typography>
        </Button>
        <Button
          onClick={onPriceRemoveClick}
          classNames={['price-hint__btn fill_w color_gray__bg color_black']}
          style={{ borderTop: "0.5px solid #A3A7B0", borderRadius: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        >
          <Typography
            variant="body"
          >
            Возврат билета
          </Typography>
        </Button>
      </div>
    </div>
  );
}

export default ScheduleBookedHint;
