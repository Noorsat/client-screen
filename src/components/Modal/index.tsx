import React, { useEffect, useState } from 'react';
import { Modal,Button as BootsButton, Row, Col, Container, Spinner } from 'react-bootstrap';
import { setOpenModal } from 'src/store/modal/modalSlice';
import ModalTicketNumber from '../ModalTicketNumber';
import './index.scss';

import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/rootReducer";

import 'antd/dist/antd.css';
import { exportTicket, getReservationDetail, getTickets, getTicketsByNumber, ticketBuyModal, updateTicket } from 'src/store/ticket/index';
import ReservationDetail from './reservationDetail';
import { ReservationTypeList } from 'src/store/ticket/types';
import InfiniteScroll from "react-infinite-scroll-component";
import { ConfigProvider, DatePicker, Space, Input, message } from 'antd';
import classNames from "classnames";
import moment from 'moment';
import locale from 'antd/lib/locale/ru_RU';
import { loadData, setSelectedTicket } from 'src/store/ticket/ticketSlice';
import { getHallPlan, getSeatsStatus } from 'src/store/hallMap/actions';
import {Modal as AModal} from 'antd';
import Button from 'src/components/Button';
import { ISeat } from 'src/core/components/types';


export default function  ModalOrder(props: any) {

  const dispatch = useDispatch();

  const [reservationList, setReservationList] = useState<any>([]);
  const [reservationDetail, setReservationDetail] = useState<any>(null);
  const [open, setOpen] = React.useState(false);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);

  const [ticketModalShow, setTicketModalShow] = useState(false);
  const [numberReservation] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'))

  const hallMap = useSelector((state: RootState) => state.hallMapReducer.halls.data);
  const updatedSeats = useSelector((state: RootState) => state.ticketSlice.seats);
  const selectedSeats = useSelector((state: RootState) => state.ticketSlice.selectedSeats);
  const selectedPayment = useSelector((state: RootState) => state.ticketSlice.payment);
  const selectedTicket = useSelector((state:RootState) => state.ticketSlice.selectedTicket)

  const loading = useSelector((state: RootState) => state.ticketSlice.loading);

  const hallSeats : any =  hallMap && [].concat(...hallMap?.zones?.map((zone:any) => {
    return zone.seats
  }));

  useEffect(() => {
    if (selectedTicket.length > 0){
      getReservationDetail(selectedTicket).then((res) => {
        if (res?.data?.status === 1){
          setSelectedTab(tabs[0])
        }else{
          setSelectedTab(tabs[1])
        }
        setReservationDetail(res?.data);
        loadData(false);
      })
    }else{
      getTickets(skip, limit, selectedDate).then((res) => {
        setReservationList(res.data);
        res.data.length > 0 && 
        getReservationDetail([...res.data][0].id).then((res) => {
          if (res?.data?.status === 1){
            setSelectedTab(tabs[0])
          }else{
            setSelectedTab(tabs[1])
          }
          setReservationDetail(res?.data);
          loadData(false);
        })
      });
    }
  }, []);

  const tabs = [
    {
      name: 'Продажа билетов',
      value: 'pay',
    },
    {
      name: 'Возврат заказа',
      value: 'cancel',
    },
  ];

  const getReservationById = (id: string) => {
    getReservationDetail(id).then((res) => {
      setReservationDetail(res?.data);
      if (res?.data?.status === 1){
        setSelectedTab(tabs[0])
      }else{
        setSelectedTab(tabs[1])
      }
      loadData(false);
    })
  }

  const loadMore = () => {
    setSkip((prev) => prev + limit);
    setLimit(5);
  }

  const searchTicketsByNumber = (number: string) => {
    getTicketsByNumber(number).then((res) => {
      setReservationList(res.data);
    });

    setTicketModalShow(false);
  }

  const onShowModal = () => {
    setTicketModalShow(true);
  }

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const onChangeDatePicker = (date: any, dateString: any) => {
    setSelectedDate(moment(date).format("YYYY-MM-DD"));
  }

  const updateSeats = () => {
    dispatch(loadData(true))

    updateTicket(reservationDetail.id, updatedSeats).then((res) => {
      if (res) {
        dispatch(loadData(false))
        message.success({
          content: "Данные обновились",
          getContainer: () => document.getElementById('calendar') as HTMLElement,
        })
      }
    }).catch((error) => {
      dispatch(loadData(false));
    })

  }

  const buyTicket = () => {
    dispatch(loadData(true))

    const data = {
      seats: selectedSeats.map((seat:any) => {
        return {
          ...seat,
         zone_id: hallSeats.filter((item : any) => item.id === seat.id)[0].zoneId
        }
      }),
      payment: selectedPayment
    }

    if (selectedSeats.length > 0) {
      ticketBuyModal(data, reservationDetail.id).then((res) => {
        if (res?.status === 200) {
          AModal.success({
            title: "Выбранные места успешно проданы!",
            onOk() {},
          })
          dispatch(loadData(false))
          exportTicket(reservationDetail.id).then(() => {
            setTimeout(() => {
              dispatch(getHallPlan(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]))
              dispatch(getSeatsStatus(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]))
            }, 0)
          })
     
        } else {
          message.error('This is a warning message');
        }
      });
    } else {
      message.error({
        content: "Выберите места!",
        getContainer: () => document.getElementById('calendar') as HTMLElement,
      })

      dispatch(loadData(false))
    }
    dispatch(setOpenModal(false));
  }

  const returnTicket = () => {
    setOpen(true)
  }

  const onOk = () => {
    if (reservationDetail.status === 1) {
      message.error({
        content: "Билет не оплачен!",
        getContainer: () => document.getElementById('calendar') as HTMLElement,
      })
    } else {
      if (selectedSeats.length > 0){
      dispatch(loadData(true))
      const selectedSeatsId = selectedSeats.map(item => item.id);
      const returnTickets = updatedSeats.length === selectedSeats.length ? updatedSeats : updatedSeats.filter(item => !selectedSeatsId.includes(item.id))
      updateTicket(reservationDetail.id, returnTickets.map((seat:any) => {
        return {
          ...seat,
         zone_id: hallSeats.filter((item : any) => item.id === seat.id)[0]?.zoneId
        }
      })).then((res) => {
        if (res.status < 400) {
          dispatch(loadData(false))
          // message.success({
          //   content: "Данные обновились",
          //   getContainer: () => document.getElementById('calendar') as HTMLElement,
          // })
          AModal.success({
            title: "Заказ успешно отменен",
          })
          dispatch(getHallPlan(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]))
          dispatch(getSeatsStatus(window.location.pathname.split("/")[window.location.pathname.split("/").length-1]))
          dispatch(setOpenModal(false))
          dispatch(setSelectedTicket(''))
        }
      }).catch((error) => {
        dispatch(loadData(false));
      })
      }else{
        message.error({
          content: "Выберите места!",
          getContainer: () => document.getElementById('calendar') as HTMLElement,
        })
      }
    }
  }

  const onCancel = () => {
    setOpen(false)
  }

  return (
    <Modal {...props}
      centered
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
      scrollable={true}
      id="modal"
      style={{borderRadius:6}}
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title id="contained-modal-title-vcenter">
            Все брони
          </Modal.Title>
        </div>
        <div className="tariff-top">
          <div className="tariff-tab d-flex">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                className={classNames(
                  'tariff-tab__item', {
                  'tariff-tab__item--active': selectedTab.value === tab.value
                }
                )}
                onClick={() => selectedTab.value === tab.value && setSelectedTab(tab)}
              >
                {tab.name}
              </div>
            ))}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row>
            <Col xs={4} md={4} className="right-side">
              <p>Список заказов</p>
              <div className="search-bar" id="calendar">
                <Input
                  placeholder="Номер брони"
                  value={numberReservation}
                  onClick={() => onShowModal()}
                  style={{borderRadius:6}}
                />
                <Space direction="horizontal">
                  <ConfigProvider locale={locale}>
                    <DatePicker defaultValue={moment(new Date(), "YYYY-MM-DD")} format="DD-MM-YYYY" onChange={onChangeDatePicker} getPopupContainer={() => document.getElementById('calendar') as HTMLElement}  />
                  </ConfigProvider>
                </Space>
              </div>
              <div className="orders-block">
                <InfiniteScroll
                  next={() => loadMore()}
                  dataLength={10}
                  hasMore={true}
                  loader={<></>}
                  endMessage={<p>End</p>}
                  height={500}
                >
                  {reservationList && reservationList.map((item: ReservationTypeList) => {
                      return (
                          <div className={`order-item ${reservationDetail?.id === item.id ? "order-item-active" : ""} ${item.status === 1 ? "order-reserved" : ""} ${item.status === 4 ? "order-canceled" : ""}`} onClick={() => getReservationById(item.id)}>
                            <div className="order-info">
                              <span className="order-info-text">#{item.number}</span>
                              <span className="order-info-text">{item.amount}</span>
                            </div>
                            <div className="order-info">
                              <span className="order-info-price">{item.movie}</span>
                            </div>
                          </div>
                      )
                    }
                  )}
                </InfiniteScroll>
              </div>
            </Col>
            <Col xs={12} md={8}>
              {reservationDetail && !loading ? (
                <ReservationDetail detail={reservationDetail} />
              ) : <> <Spinner animation="border" variant="danger" /> </>}
            </Col>
          </Row>
          <ModalTicketNumber show={ticketModalShow} onHide={() => setTicketModalShow(false)} searchreservation={searchTicketsByNumber} />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <BootsButton onClick={() => dispatch(setOpenModal(false))} className="btn-back">Назад</BootsButton>
        <BootsButton onClick={() => updateSeats()} className="btn-back">Сохранить</BootsButton>
        {selectedTab.value === 'pay' ?
          <BootsButton onClick={() => buyTicket()} className="btn-back-ticket">Провести оплату</BootsButton>
          :
          <BootsButton onClick={() => returnTicket()} className="btn-back-ticket">Вернуть билеты</BootsButton>
        }
      </Modal.Footer>
      <AModal
            title="Возврат билета"
            visible={open}
            style={{zIndex:1000000000}} 
            zIndex={100000000000000000000}
            footer={[
              <Button onClick={onCancel} color="black" className='me-3'>
                Нет, сохранить заказ
              </Button>,
              <Button onClick={onOk} color="red"> 
                Да, сделать возврат
              </Button>
            ]}
          >
          <p>При возврате билета, бронь всех мест, привязанных к данному заказу будет отменена</p>
      </AModal>
    </Modal >
  );
}