import './index.scss';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import rus from 'dayjs/locale/ru';

const NewScheduleDate = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [dates, setDates] = useState<any>();

    dayjs.locale(rus);

    useEffect(() => {
        let dates = [];

        dates.push(dayjs())

        for (let i = 1; i < 7; i++){
            dates.push(dayjs().add(i, 'day'));
        }

        setDates(dates);
    }, [])

    const dateChangeHandler = (date : any) => {
        setSelectedDate(date);
    }

    return (
        <div className='date'>
            <div className='date__items'>
                {
                    dates?.map((date: any, index : number) => (
                        <div className={`date__item ${ dayjs(date).format('DD/MM/YYYY') === (dayjs(selectedDate).format('DD/MM/YYYY')) && 'selected' }`} onClick={() => dateChangeHandler(date)}>  
                            <div className='date__item-name'>
                                { dayjs(date).format('dddd').charAt(0).toUpperCase() + dayjs(date).format('dddd').slice(1) }
                            </div>
                            <div className='date__item-number'>
                                { index === 0 && 'Cегодня, '} { index === 1 && 'Завтра, '} { dayjs(date).format('D MMMM') }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default NewScheduleDate;