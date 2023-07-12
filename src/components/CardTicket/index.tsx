import * as React from 'react';
import classNames from 'classnames';
import { removeLettersFromSeat } from 'src/utils/serialization';
import { isSeatLoveSeats1, isSeatLoveSeats2, isSeatVIP, isSeatWheelchair } from 'src/utils/validation';
import Button from 'src/components/Button';
import Typography from 'src/components/Typography';
import Dropdown from 'src/components/Dropdown';
import { splitNumber } from 'src/constants/constants';
import { DropdownItemTypes } from 'src/components/Dropdown/types';
import { CardTicketTypes, ellipsisV } from 'src/components/CardTicket/types';
import Cross from 'src/assets/images/cross.svg';
import './index.scss';

function CardTicket(props: CardTicketTypes.IProps): JSX.Element {
  const { hasOptions, ticket, onRemoveTicket, selectedTickets } = props;
  const [isPriceChangeable, setPriceChangeable] = React.useState<boolean>(false);
  const prices = props.prices || [];
  const priceVIP = props.priceVIP || [];
  const priceType = isSeatVIP(ticket.seat) ? priceVIP : prices;

  const ticketRemoveHandler = () => {
    if (onRemoveTicket && selectedTickets){
      onRemoveTicket(ticket.seat);
    }
  }
  
  const onSelectDropdown = (option: DropdownItemTypes.IProps) => {
    if (option.id === '2') {
      if (props.onRemoveTicket) {
        props.onRemoveTicket(ticket);
      }
    } else if (option.id === '1') {
      setPriceChangeable(true);
    }
  };

  const onChangeTariff = (tariff: string, price: number) => () => {
    if (props.onChangeTariff) {
      props.onChangeTariff(tariff, price);
    }
    setPriceChangeable(false);
  };

  const ticketDropdown: DropdownItemTypes.IProps[] = [
    {
      id: '1',
      title: 'Изменить тариф',
      active: false,
    },
    {
      id: '2',
      title: 'Удалить место',
      active: false,
      disabled: !props.removable,
      hint: props.removable
        ? null :
        <Typography
          variant="subbody"
          className="text-left my-8 mx-12"
        >
          Пожалуйста, не оставляйте
          <Typography
            variant="subbody"
            className="color_red ml-4"
          >
            незанятое место
          </Typography>
          , если есть альтернативные места в том же ряду.
        </Typography>,
    },
  ];

  return (
    <>
      <div className={classNames(['card-ticket color_white', {
        'card-ticket--love-seat': isSeatLoveSeats1(ticket.seat) || isSeatLoveSeats2(ticket.seat),
        'card-ticket--wheel-seat': isSeatWheelchair(ticket.seat),
        'card-ticket--vip-seat': isSeatVIP(ticket.seat),
      }])}>
        <div className="d-flex justify-content-between align-items-center">
          <Typography
            variant="subbodybold"
            mobileVariant="caption"
            className={'lh-18'}
          >
            {`${ticket.seat.rowText} ряд, ${removeLettersFromSeat(ticket.seat.colText)} место`}
          </Typography>
          <div>
            <img src={Cross} onClick={ticketRemoveHandler}/>
          </div>
          {hasOptions && (
            <Dropdown
              isLabelHidden
              variantTitleButton="caption"
              title=""
              icon={ellipsisV}
              className="card-ticket-dropdown"
              onSelectOption={onSelectDropdown}
              listNode={ticketDropdown}
            />
          )}
        </div>
        <div className="d-flex justify-content-between align-items-end card-ticket__info mt-0 mt-md-4">
          <Typography
            variant="subbody"
            mobileVariant="captionbold"
            className="card-ticket__info__types d-flex flex-column"
          >
            <div className="card-ticket__info__seat">
              {isSeatWheelchair(ticket.seat) ? `Место для кресел-колясок, ` : ''}
              {(isSeatLoveSeats1(ticket.seat) || isSeatLoveSeats2(ticket.seat)) ? 'Love seats, ' : ''}
            </div>
            <div>
              {`${ticket?.seat?.name}`}
            </div>
          </Typography>
          <Typography
            variant="subbodybold"
            className="color_grey card-ticket__info__price"
          >
            {splitNumber(ticket.price)} ₸
          </Typography>
        </div>
      </div>
      {isPriceChangeable && (
        <div className="mt-4 ticket-tariff-group">
          <div className="d-flex flex-column align-items-center">
            {Object.keys(priceType).map((n: string, i) => {
              // @ts-ignore
              const price = priceType[n];
              return (
                <Button
                  key={i}
                  onClick={onChangeTariff(n, price.value)}
                  classNames={['p-8 ticket-tariff fill_w color_white__bg color_black text-left', {
                    'ticket-tariff--selected': props.ticket.type === n,
                  }]}
                >
                  <Typography
                    variant="subbody"
                    className="lh-22"
                  >
                    {`ticket:${n}`}:
                  </Typography>
                  <Typography
                    variant="subbodybold"
                    className="lh-22 ml-1"
                  >
                    {splitNumber(price.value)} ₸
                  </Typography>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default CardTicket;
