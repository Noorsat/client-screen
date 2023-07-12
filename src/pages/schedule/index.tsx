import classNames from 'classnames';
import 'moment/locale/ru';
import './index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleToday } from 'src/store/schedule/actions';
import { useCallback, useEffect, useState } from "react";
import {
  ISO_DATE_FORMAT,
  TEXT_DATE_WEEKDAY_FORMAT,
  TEXT_TIME_FORMAT
} from "../../constants/date";
import { getCurrentDate, getTomorrowDate, isTimeWillPass } from "../../utils/date";
import { RootState } from "../../store/rootReducer";
import { dateTransform, timeTransform } from "../../utils/transform";
import Preloader from "../../components/Preloader";
import { ScheduleResponse } from "../../store/schedule/types";
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ru';
import locale from 'antd/lib/locale/ru_RU';
import 'antd/dist/antd.css';
import { BiLogOut, BiCameraMovie } from 'react-icons/bi';
import { TbListNumbers } from 'react-icons/tb'
import { MdExpandMore } from 'react-icons/md';
import { Button, Modal, Tooltip, Checkbox, ConfigProvider, DatePicker, Space } from 'antd';
import { getHallPlan, getSeatsStatus } from 'src/store/hallMap/actions';
import kzFlag from 'src/assets/images/kz_d.png';
import engFlag from 'src/assets/images/eng_d.png';
import * as io from "socket.io-client";
const socket = io.connect('localhost:5000');



export const SchedulePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isTodayActive, setIsTodayActive] = useState<boolean>(true);
  const [isTomorrowActive, setIsTomorrowActive] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [showDate, setShowDate] = useState<any>();
  const [date, setDate] = useState<string>(moment().format("HH:mm:ss"));
  const [sales, setSales] = useState<boolean>(false);

  const managerName = localStorage.getItem("managerName")
  const pos = localStorage.getItem("pos")
  const side = localStorage.getItem("side")

  const [filteredSchedule, setFilteredSchedule] = useState<any>();

  const scheduleToday: ScheduleResponse.IGet[] = useSelector(
    (state: RootState) => state.schedulesReducer.scheduleToday.data,
  );
  const scheduleTodayLoading: boolean = useSelector(
    (state: RootState) => state.schedulesReducer.scheduleToday.loading,
  );

  useEffect(() => {
    setFilteredSchedule(scheduleToday?.map(seance => {
      return {
        ...seance, isNameSelected: false, isHallSelected: false
      }
    }))
  }, [scheduleToday]);

  useEffect(() => {
    if (side === "client"){
      socket && socket.on('selectSeanceResponse', (data : any) => {
        if (data?.pos == pos){
          navigate(`/seance/${data?.seanceId}`);
        }
      })
      socket && socket.on('tomorrowResponse', (data : any) => {
        if (data?.pos == pos){
          dispatch(getScheduleToday({
            skip: 0,
            limit: 0,
            dateTo: getTomorrowDate(ISO_DATE_FORMAT),
            dateFrom: getTomorrowDate(ISO_DATE_FORMAT),
          }))
          setIsTodayActive(false);
          setShowDate(getTomorrowDate(ISO_DATE_FORMAT))
          setIsTomorrowActive(true);
        }
      })
  
      socket && socket.on('todayResponse', (data : any) => {
        if (data?.pos == pos){
          dispatch(getScheduleToday({
            skip: 0,
            limit: 0,
            dateTo: getCurrentDate(ISO_DATE_FORMAT),
            dateFrom: getCurrentDate(ISO_DATE_FORMAT),
          }))
          setIsTodayActive(true);
          setShowDate(getCurrentDate(ISO_DATE_FORMAT))
          setIsTomorrowActive(false);
        }
      })
  
      socket && socket.on('selectDateResponse', (data: any) => {
        if (data?.pos == pos){
          dispatch(getScheduleToday({
            skip: 0,
            limit: 0,
            dateTo: moment(data.date).format(ISO_DATE_FORMAT),
            dateFrom: moment(data.date).format(ISO_DATE_FORMAT),
          }))
          setShowDate(data.date)
        }
      })
    }
  }, [socket])

  const tomorrowDateClicked = () => {
    dispatch(getScheduleToday({
      skip: 0,
      limit: 0,
      dateTo: getTomorrowDate(ISO_DATE_FORMAT),
      dateFrom: getTomorrowDate(ISO_DATE_FORMAT),
    }))
    setIsTodayActive(false);
    setShowDate(getTomorrowDate(ISO_DATE_FORMAT))
    setIsTomorrowActive(true);
    socket && socket.emit('tomorrow', {
      pos: pos
    });
  }

  const todayDateClicked = () => {
    dispatch(getScheduleToday({
      skip: 0,
      limit: 0,
      dateTo: getCurrentDate(ISO_DATE_FORMAT),
      dateFrom: getCurrentDate(ISO_DATE_FORMAT),
    }))
    setIsTodayActive(true);
    setShowDate(getCurrentDate(ISO_DATE_FORMAT))
    setIsTomorrowActive(false);
    socket && socket.emit('today', {
      pos: pos
    });
  }

  const onClickSeance = useCallback((seance: ScheduleResponse.IGetSeances) => () => {
    socket && socket.emit('selectSeance', {
      seanceId: seance.id,
      id: socket.id,
      socketId: socket.id,
      pos: pos
    })
    navigate(`/seance/${seance.id}`);
    dispatch(getHallPlan(seance.id))
    dispatch(getSeatsStatus(seance.id))
  }, [navigate])

  function onChange(date: any, dateString: any) {
    dispatch(getScheduleToday({
      skip: 0,
      limit: 0,
      dateTo: moment(date).format(ISO_DATE_FORMAT),
      dateFrom: moment(date).format(ISO_DATE_FORMAT),
    }))
    setShowDate(date)
    socket.emit('selectDate', {
      pos: pos,
      date: date
    })
  }

  useEffect(() => {
    isTodayActive && dispatch(getScheduleToday({
      skip: 0,
      limit: 0,
      dateTo: getCurrentDate(ISO_DATE_FORMAT),
      dateFrom: getCurrentDate(ISO_DATE_FORMAT),
    }))
    setShowDate(new Date())
  }, [])

  setTimeout(() => {
    setDate(moment().format("HH:mm:ss"))
  }, 1000)

  const logoutHandler = () => {
    setVisible(true);
  }

  const handleOk = () => {
    localStorage.removeItem("authTokens")
    localStorage.removeItem("userID")
    window.location.reload()
  };

  const handleCancel = () => {
    setVisible(false);
  };


  const filterHandler = (name: any, type: string, e?: any) => {
    setFilteredSchedule(filteredSchedule?.map((seance: any) => {
      if (type === "name") {
        if (seance?.name === name) {
          seance.isNameSelected = !seance?.isNameSelected
        }
        return seance;
      } else if (type === "hall") {
        if (seance?.seances?.length > 1) {
          if (e.target.checked === false) {
            seance.isHallSelected = false;
          } else {
            seance?.seances?.map((item: any) => {
              if (item?.hall?.name === name) {
                seance.isHallSelected = true;
              }
            });
          }
        } else {
          seance?.seances?.map((item: any) => {
            if (item?.hall?.name === name) {
              seance.isHallSelected = !seance?.isHallSelected;
            }
          });
        }

        return seance;
      }
    }))
  }


  const movieHallFilter = <div>
    {
      filteredSchedule?.length > 0 && filteredSchedule?.map((schedule: any) => {
        return schedule?.seances?.map((seance: any) => {
          return seance?.hall?.name
        })
      })?.reduce((pre: any, cur: any) => {
        return pre?.concat(cur);
      })?.filter(function (value: any, index: any, array: any) {
        return array.indexOf(value) === index;
      })?.map((hall: any) => {
        return (
          <div className='d-flex align-items-center'>
            <div className='me-2'>
              <Checkbox onChange={(e) => filterHandler(hall, "hall", e)} />
            </div>
            <div>
              {hall}
            </div>
          </div>
        )
      })
    }
  </div>

  const movieNameFilter =
    <div>
      {
        filteredSchedule?.map((seance: any) => {
          return (
            <div className='d-flex align-items-center'>
              <div className='me-2'>
                <Checkbox onChange={() => filterHandler(seance?.name, "name")} />
              </div>
              <div>
                {seance?.name}
              </div>
            </div>
          )
        })
      }
    </div>

  const salesHandler = () => {
    if (sales) {
      setFilteredSchedule(scheduleToday);
    } else {
      setFilteredSchedule(scheduleToday?.map(movie => {
        return { ...movie, seances: movie?.seances?.filter(seance => seance?.statistics?.payed > 0 || seance?.statistics?.reserved > 0) }
      }))
    }
    setSales(!sales)
  }


  const moreFilter =
    <div className='payment'>
      <Checkbox id='payment' name='payment' checked={sales} onChange={salesHandler} />
      <label className='payment__label' htmlFor='payment'>
        Есть продажа
      </label>
    </div>



  const getFlag = (lang: string) => {
    switch (lang) {
      case "kaz": return <img src={kzFlag} width={24} className="me-1" style={{ position: "absolute", left: 8, top: 4 }} />;
        break;
      case "eng": return <img src={engFlag} width={24} className="me-1" style={{ position: "absolute", left: 8, top: 4 }} />;
        break;
    }
  }

  return (
    <div className="schedule my-1 mx-3">
      <Modal
        visible={visible}
        title="Выйти из аккаунта"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Назад
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Выйти
          </Button>
        ]}
      >
        <p>Подтвердите выход из аккаунта</p>
      </Modal>
      <div className='d-flex'>
        <div className="schedule-title w-100 text-center">Репертуар</div>
        <div style={{ position: "absolute", right: 20, top: 10, cursor: "pointer", display:"flex", alignItems:"center"}} >
          {
            side === 'cashier' && (
              <div className='me-3'>
                Кассир: {managerName}
              <br>
                </br>
                POS: {pos}
              </div>
            )
          }
          <div onClick={logoutHandler}>
            <BiLogOut size={25} />
          </div>
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-between schedule-top">
          <div className="d-flex align-items-center">
            <div className="d-flex schedule-top__left">
              <button
                className={classNames('schedule-tab mr-8', isTodayActive && 'schedule-tab--active')}
                onClick={todayDateClicked}
              >
                Сегодня
              </button>
              <button
                className={classNames('schedule-tab', isTomorrowActive && 'schedule-tab--active')}
                onClick={tomorrowDateClicked}
              >
                Завтра
              </button>
            </div>
            <div className='me-5'>
              <Space direction="vertical">
                <ConfigProvider locale={locale}>
                  <DatePicker defaultValue={moment(new Date(), 'YYYY-MM-DD')} format="DD-MM-YYYY" onChange={onChange} />
                </ConfigProvider>
              </Space>
            </div>
            <Tooltip placement='bottom' trigger="click" className='me-5' title={movieNameFilter}>
              <BiCameraMovie size={30} />
            </Tooltip>
            <Tooltip placement='bottom' trigger="click" className='me-5' title={movieHallFilter}>
              <TbListNumbers size={30} />
            </Tooltip>
            <Tooltip placement='bottom' trigger="click" className='me-5' title={moreFilter}>
              <MdExpandMore size={30} />
            </Tooltip>
          </div>
          <div>
            <span className="schedule-top--right">
              {
                new Date().getHours() >= 0 && new Date().getHours() <= 6 ? dateTransform(getCurrentDate(moment(showDate).subtract(1, "days").format("YYYY-MM-DDTHH:mm:ss")), TEXT_DATE_WEEKDAY_FORMAT) : dateTransform(getCurrentDate(moment(showDate).format("YYYY-MM-DDTHH:mm:ss")), TEXT_DATE_WEEKDAY_FORMAT)
              }
            </span>
            <div className='d-flex justify-content-end time'>
              {
                date
              }
            </div>
          </div>
        </div>
        <div className="w-100 d-flex justify-content-center">
          <Preloader
            color="red"
            size={5}
            spinnerSize={8}
            loading={scheduleTodayLoading}
            classNames="my-5"
          >
            <div className="d-flex flex-column w-100">
              {filteredSchedule?.filter((schedule: any) => schedule?.isNameSelected === true || schedule?.isHallSelected === true).length > 0 || sales ? filteredSchedule.filter((schedule: any) => schedule.isNameSelected === true || schedule?.isHallSelected === true || sales).map((movie: any, index: any) => (
                <div key={index} className={`schedule-item d-flex justify-content-between ${movie?.seances?.filter((item: any) => !isTimeWillPass(item.end_time, 0)).length === 0 && "schedule--item__unactive"}`}>
                  <div className="schedule-item__left">
                    <div className="schedule-item__title">{movie.name}</div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex flex-wrap schedule-item__genres">
                        {movie.genre?.map((genre: any, ind: any) => {
                          return movie.genre && ind === movie.genre?.length - 1 ?
                            <span key={ind} className="schedule-item__genre">{genre}</span> :
                            <span key={ind} className="schedule-item__genre">{genre} &#183;</span>
                        })}
                      </div>
                      {movie.certification && <div className="schedule-item__age">
                        <div className="schedule-item__age-text">
                          {movie.certification}
                        </div>
                      </div>}
                    </div>
                    <div className="schedule-item__duration">
                      Продолжительность: <b>{movie.duration} минут</b>
                    </div>
                  </div>
                  <div className="schedule-item__right d-flex flex-wrap">
                    {movie.seances?.map((seance: any, i: any) => (
                      <div key={i} className={`schedule-item__right__div d-flex flex-column align-items-center" ${isTimeWillPass(seance.end_time, 0) && "schedule__item-right-item"}`}>
                        <button
                          className={classNames(['schedule-item__btn w-100', !isTimeWillPass(seance.start_time, -180) && 'schedule-item__btn--active'])}
                          disabled={isTimeWillPass(seance.start_time, -180)}
                          onClick={onClickSeance(seance)}
                        >
                          {timeTransform(seance.start_time, TEXT_TIME_FORMAT)}
                        </button>
                        <span className="schedule-item__btn__hall text-center">{seance.hall.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )) :
                scheduleToday?.map((movie: any, index: any) => (
                  <div key={index} className={`schedule-item d-flex justify-content-between ${movie?.seances?.filter((item: any) => !isTimeWillPass(item.end_time, 0)).length === 0 && "schedule--item__unactive"}`}>
                    <div className="schedule-item__left">
                      <div className="schedule-item__title">{movie.name}</div>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-wrap schedule-item__genres">
                          {movie.genre?.map((genre: any, ind: any) => {
                            return movie.genre && ind === movie.genre?.length - 1 ?
                              <span key={ind} className="schedule-item__genre">{genre}</span> :
                              <span key={ind} className="schedule-item__genre">{genre} &#183;</span>
                          })}
                        </div>
                        {movie.certification && <div className="schedule-item__age">
                          <div className="schedule-item__age-text">
                            {movie.certification}
                          </div>
                        </div>}
                      </div>
                      <div className="schedule-item__duration">
                        Продолжительность: <b>{movie.duration} минут</b>
                      </div>
                    </div>
                    <div className="schedule-item__right d-flex flex-wrap">
                      {movie.seances?.map((seance: any, i: any) => (
                        <div key={i} className={`schedule-item__right__div d-flex flex-column align-items-center ${isTimeWillPass(seance.end_time, 0) && "schedule__item-right-item"}`}>
                          <button
                            className={classNames(['schedule-item__btn schedule-item__btn--active w-100 position-relative'])}
                            disabled={isTimeWillPass(seance.start_time, -180)}
                            onClick={onClickSeance(seance)}
                          >
                            {
                              getFlag(seance?.language)
                            }
                            {timeTransform(seance.start_time, TEXT_TIME_FORMAT)}
                          </button>
                          <span className="schedule-item__btn__hall text-center">{seance.hall.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          </Preloader>
        </div>
      </div>
    </div>
  );
};
