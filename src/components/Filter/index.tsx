import './index.scss';
import FilterIcon from 'src/assets/images/filter.svg'

const Filter = () => {
    return (
        <div className='filter'>
            <div className='filter__icon'>
                <img src={FilterIcon} />
            </div>
            <div className='filter__title'>
                Фильтр
            </div>
        </div>
    )
}

export default Filter;
