import {FC} from 'react';
import ru from 'src/assets/images/rus.png';
import './index.scss';

const NewScheduleSeance : FC = () => {
    return (
        <div className='seance'>
            <div className='seance__top'>
                <div className='seance__lang'>
                    <div className='seance__lang-icon'>
                        <img src={ru} />
                    </div>
                    <div className='seance__lang-type'>
                        Рус
                    </div>
                </div>
                <div className='seance__hall-type'>
                    3D
                </div>
            </div>
            <div className='seance__middle'>
                <div className='seance__time'>
                    10:10
                </div>
                <div className='seance__left'>
                    <div className='seance__left-dot'>
                    </div>
                    <div className='seance__left-time'>
                        30 мин
                    </div>
                </div> 
            </div>
            <div className='seance__hall'>
                ЗАЛ 2
            </div>
        </div>
    )
}

export default NewScheduleSeance;