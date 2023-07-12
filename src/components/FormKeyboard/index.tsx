import * as React from 'react';
import KeyboardWrapper from "./KeyboardWrapper";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import Checkbox from "../Checkbox";
import './index.scss';
import { FormKeyboardTypes } from "./types";
import classNames from "classnames";
import { ITicket } from "../../core/components/types";
import { getContracts, getHallPlan, getSeatsStatus, ticketReserved } from "../../store/hallMap/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { HallMapReducerTypes } from "../../store/hallMap/types";
import { Modal } from 'antd'
import { apiTicketReserve } from 'src/store/hallMap/api';
import * as io from "socket.io-client";
const socket = io.connect('localhost:5000');


export const FromKeyboard = (props: FormKeyboardTypes.IProps) => {
  const { selectedTickets, seanceId, setSelectedTickets } = props;
  const [inputs, setInputs] = useState({});
  const [inputName, setInputName] = useState("default");
  const [reserveDeadline, setReserveDeadline] = useState(30);
  const [contractId, setContractId] = useState('');
  const [cancelReservation, setCancelReservation] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const keyboard = useRef<any>();
  const dispatch = useDispatch();
  const contractsList = useSelector((state: RootState) => state.hallMapReducer.contracts.data);

  const managerName = localStorage.getItem("managerName")

  const onChangeInput = (event: any) => {
    const inputVal = event.target.value;

    setInputs({
      ...inputs,
      [inputName]: inputVal
    });

    keyboard?.current && keyboard?.current?.setInput(inputVal);
  };

  const onChangeAll = (inputs: string) => {
    setInputs(inputs);
  };

  const onChangeDeadline = (e: any) => {
    setReserveDeadline(e.target.value);
  };

  const onContractChange = (e: any) => {
    setContractId(e.target.value);
  };

  const getInputValue = (inputName: string) => {
    // @ts-ignore
    return inputs[inputName] || "";
  };

  const onReserveClick = () => {
    const reserveData: HallMapReducerTypes.ITicketReserveRequest | any = {
      seance_id: seanceId,
      comment: getInputValue('textAreaName'),
      deadline: cancelReservation ? `` : `start-${reserveDeadline}m`,
      seats: selectedTickets.map((n: ITicket) => {
        return {
          id: n.seat.id,
          discount_id: n.discountId,
          zone_id: n.seat.zoneId
        }
      }),
      contract: {
        id: contractId,
      }
    };
    props.onCloseModal();
    setSelectedTickets([])

    apiTicketReserve(reserveData).then((res) => {
      if (res?.status < 400) {
        Modal.success({
          title: cancelReservation ? "Места успешно забронированы" : "Места успешно забронированы. Места будут сняты за 30 минут до начала сеанса",
          onOk() {
            dispatch(getHallPlan(seanceId))
            dispatch(getSeatsStatus(seanceId))
          },
        }) 
        socket.emit('reserve', {
          seanceId: seanceId,
          success: true
        })
      }else{
        socket.emit('reserve', {
          error: true
        })
        Modal.error({
          title: "Ошибка связи с сервером",
          onOk: () => {
            setTimeout(() => {
              dispatch(getHallPlan(seanceId))
              dispatch(getSeatsStatus(seanceId))
            }, 0)
          }
        })
      }
    });
  };

  useEffect(() => {
    dispatch(getContracts());
  }, [dispatch])

  useEffect(() => {
    contractsList && contractsList[0]?.id && setContractId(contractsList[0]?.id);
  }, [contractsList])

  return (
    <div className="form">
      <div className={classNames(['form-top', isKeyboardVisible && 'form-top--mini'])}>
        <div className="form-bg" onClick={() => setIsKeyboardVisible(false)} />
        <div
          className={classNames(['form-content', isKeyboardVisible && 'form-content--mini'])}
        >
          <div className="form-content__title">
            <span>Забронировать №123456</span>
          </div>
          <div
            className={classNames(['form-content__center d-flex flex-column',
              isKeyboardVisible && 'form-content__center--mini'])}
          >
            <span className="form-content__heading">Введите имя кассира</span>
            <input
              type="text"
              value={getInputValue('inputName') || managerName}
              name="inputName"
              className="lh-22"
              onChange={onChangeInput}
              disabled
              onFocus={() => {
                setInputName("inputName");
                setIsKeyboardVisible(true)
              }}
            />
            <span className="form-content__heading">Комментарий</span>
            <textarea
              name="textAreaName"
              value={getInputValue('textAreaName')}
              onChange={onChangeInput}
              onFocus={() => {
                setInputName("textAreaName");
                setIsKeyboardVisible(true)
              }}
            />
            <div className="d-flex">
              <div className="d-flex flex-column mr-48">
                <span className="form-content__heading">Тип бронирования</span>
                <select className="form-content__center__select" onChange={onContractChange}>
                  {contractsList && contractsList?.map((n: any, index: number) => (
                    <option key={index} value={n?.id}>{n?.name}</option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column">
                <span className="form-content__heading ml-16">Снять бронь</span>
                <div className="d-flex ml-16 align-items-center">
                  <span>За</span>
                  <input
                    className="cancelInput"
                    style={{ width: '48px', height: '32px', padding: '0 15px', margin: '0 10px' }}
                    defaultValue={reserveDeadline}
                    onChange={onChangeDeadline}
                  />
                  <span>минут</span>
                </div>
                <div className="d-flex align-items-center">
                  <Checkbox isClicked={cancelReservation} setClicked={() => setCancelReservation(!cancelReservation)} />
                  <span className="ml-12">Не снимать</span>
                </div>
              </div>
            </div>
          </div>
          <div className="form-content__bottom d-flex align-items-center justify-content-end">
            <div className="d-flex">
              <Button
                type="transparent"
                className="form-content__bottom__btn mr-16"
                onClick={() => props.onCloseModal()}
              >
                Отмена
              </Button>
              <Button
                color="red"
                className="form-content__bottom__btn"
                onClick={onReserveClick}
              >
                Забронировать
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isKeyboardVisible && (
        <div className="form-bottom">
          <KeyboardWrapper
            keyboardRef={keyboard}
            onChangeAll={onChangeAll}
            inputName={inputName}
          />
        </div>
      )}
    </div>
  );
};
