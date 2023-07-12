import Calendar from '../Calendar';
import Filter from '../Filter';
import './index.scss';

const NewScheduleHeader = () => {
    return (
        <div className='header'>
             <div className='header__wrapper'>
                <div className='header__wrapper-left'>
                    <div className='header__time'>
                        16 декабря 2022, 14:43 
                    </div> 
                    <div className='header__title'>
                        Репертуар
                    </div>
                </div>
                <div className='header__wrapper-right'>
                    <div className='header__filter'>
                        <Filter />
                    </div>
                    <div className='header__calendar'>
                        <Calendar />
                    </div>
                </div>`
            </div>
        </div>
    )
}

export default NewScheduleHeader;