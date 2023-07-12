import * as React from 'react';
import classNames from 'classnames';
import { removeLettersFromSeat } from 'src/utils/serialization';
import { isSeatLoveSeats1, isSeatLoveSeats2, isSeatWheelchair } from 'src/utils/validation';
import Typography from 'src/components/Typography';
import { splitNumber } from 'src/constants/constants';
import { ITicket } from 'src/core/components/types';
import { GroupCardTicketExpandableTypes } from 'src/components/CardTicket/types';
import { chevronDown } from 'src/components/ScrollButton/types';
import Image from 'src/components/Image';
import './index.scss';

function GroupCardTicketExpandable(props: GroupCardTicketExpandableTypes.IProps): JSX.Element {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const tickets = props.tickets || [];
  const ticketsTotalPrice = tickets.reduce((totalSum, ticket) => totalSum + ticket.price, 0);

  const onToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <div
        className={classNames('group-card-ticket--expand d-flex p-4 pl-8 fill_w', {
          'group-card-ticket--expand--on': expanded,
        })}
        onClick={onToggleExpand}
      >
        <div>
          <Typography
            variant="subbodybold"
            className="d-block"
          >
            {tickets.length} билета
          </Typography>
          <Typography
            variant="subbody"
            className="lh-22"
          >
            {splitNumber(ticketsTotalPrice)} ₸
          </Typography>
        </div>
        <div
          className="ml-auto"
        >
          <Image
            src={chevronDown}
            alt="chevron down"
            className={classNames(
              'group-card-ticket--expand__i',
              { 'group-card-ticket--expand__i--on': expanded },
            )}
          />
        </div>
      </div>
      {expanded && (
        tickets.map((n: ITicket) => (
          <div className="group-card-ticket--expand__item p-4 pl-8 fill_w">
            <Typography
              variant="subbodybold"
            >
              {`${n.seat.rowText} ряд, ${removeLettersFromSeat(n.seat.colText)} место`}
            </Typography>
            <div className="d-flex justify-content-between align-items-end">
              <Typography
                variant="subbody"
                className="d-flex flex-column col"
              >
                {isSeatWheelchair(n.seat) ? 'Место для кресел-колясок, ' : ''}
                {(isSeatLoveSeats1(n.seat) || isSeatLoveSeats2(n.seat)) ? 'Love seats, ' : ''}
                {n.type}
              </Typography>
              <Typography
                variant="caption"
                className="color_grey card-ticket__info__price lh-18"
              >
                {splitNumber(n.price)} ₸
              </Typography>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default GroupCardTicketExpandable;
