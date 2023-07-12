import './index.scss';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ru_RU';

const Calendar = () => {
    return (
       <DatePicker locale={locale} format={'D MMMM'}/>
    )
}

export default Calendar;