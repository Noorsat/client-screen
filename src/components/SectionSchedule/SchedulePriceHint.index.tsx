import classNames from 'classnames';
import Hint from 'src/components//Hint';
import Typography from 'src/components/Typography';
import Button from 'src/components/Button';
import { SchedulePriceHintTypes } from 'src/components/SectionSchedule/types';
import { ScheduleTypes } from 'src/store/schedule/types';
import { splitNumber } from 'src/constants/constants';
import './index.scss';
import crossIcon from 'src/assets/images/cross.svg';

function SchedulePriceHint(props: SchedulePriceHintTypes.IProps) {
  const onPriceClick = (label: string, discount: ScheduleTypes.IDiscountInfo) => () => {
    if (props.onTicketSelect) {
      props.onTicketSelect(label, discount);
    }
  };

  const onPriceRemoveClick = () => {
    if (props.onTicketRemove) {
      props.onTicketRemove();
    }
  };

  const { selectable, selected, removable, selectedDiscount } = props;
  const prices = props.prices || [];

  return (
    <div className={
      classNames(
        'price-hint',
        [selectable ? 'p-0' : 'p-12 pt-8'],
      )}
      >
      
      {!selectable && (
        <Typography
          variant="caption"
          className="d-block text-left"
        >
          Цены
        </Typography>
      )}
      {
        removable ?
          <Button
            onClick={onPriceRemoveClick}
            className="price-hint__delete w-100 d-flex justify-content-between"
          >
            <Typography
              variant="subbodybold"
              className="lh-22 price-hint__delete__text"
            >
              {props.seat?.rowText} ряд {props.seat?.colText} место
            </Typography>
            <div className="d-flex justify-content-center align-items-center" style={{ background: '#FFFFFF', width: '20px', height: '20px', borderRadius: '50%' }}>
              <img width={'16px'} height={'16px'} src={crossIcon} alt="cross" />
            </div>
          </Button> : <Button
          className="price-hint__delete w-100 d-flex justify-content-between"
        >
          <Typography
            variant="subbodybold"
            className="lh-22 price-hint__delete__text"
          >
            {props.seat?.rowText} ряд {props.seat?.colText} место
          </Typography>
        </Button>
      }
      {Object.keys(prices).map((n: string, i) => {
        // @ts-ignore
        const price = prices[n];
        return (
          <div key={i} className="d-flex align-items-center">
            
            {selectable ?
            
              <Button
                onClick={onPriceClick(n, price)}
                classNames={['w-100 p-8 price-hint__btn fill_w color_white__bg color_black text-start', {
                  'price-hint__btn__selected': selected === n,
                }]}
              >
                <Typography
                  variant="subbodybold"
                  className="lh-22"
                >
                  {`${price.name}`}:
                </Typography>
                <Typography
                  variant="subbodybold"
                  className="lh-22 ml-1"
                >
                  {splitNumber(price.value)} ₸
                </Typography>
              </Button> :
              <>
                <Typography
                  variant="subbody"
                  className="lh-22"
                >
                  {`${n}`}:
                </Typography>
                <Typography
                  variant="subbodybold"
                  className="lh-22 ml-1"
                >
                  {splitNumber(price.value)} ₸
                </Typography>
              </>
            }
          </div>
        );
      })}
    </div>
  );
}

export default SchedulePriceHint;
