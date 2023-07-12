import * as React from 'react';
import classNames from 'classnames';
import Typography from 'src/components/Typography';
import CardTicket from 'src/components/CardTicket/index';
import { GroupCardTicketTypes } from 'src/components/CardTicket/types';
import { ITicket } from 'src/core/components/types';
import './index.scss';

function GroupCardTicket(props: GroupCardTicketTypes.IProps): JSX.Element {
  const [tickets, setTickets] = React.useState<ITicket[]>();

  React.useEffect(
    () => {
      setTickets(props.tickets);
    },
    [props.tickets],
  );

  const onChangeTariff = (ticket: ITicket) => (tariffLabel: string, price: number) => {
    props.onChangeTariff && props.onChangeTariff(ticket, tariffLabel, price);
  };

  return (
    <div className="pos_relative">
      <div className={classNames([
        'group-card-ticket pos_relative',
         { 'group-card-ticket--no-overflow': tickets && tickets.length < 3 },
      ])}>
        {tickets && (
          tickets.length > 0 ? (
            tickets.map((n: ITicket, i) => (
              <div key={i} className="group-card-ticket__item mb-8">
                <CardTicket
                  ticket={n}
                  prices={props.prices}
                  priceVIP={props.priceVIP}
                  hasOptions={props.hasOptions}
                  onRemoveTicket={props.onRemoveTicket}
                  removable={props.checkTicketRemovability && props.checkTicketRemovability(n)}
                  onChangeTariff={onChangeTariff(n)}
                />
              </div>
            ))
          ) : <div className="group-card-ticket__info d-flex align-items-center py-8 px-16">
            {/*<div className="group-card-ticket__info__img-wrap">*/}
            {/*  <Image*/}
            {/*    src={ticketsLogo}*/}
            {/*    alt="ticket"*/}
            {/*    className="group-card-ticket__info__img"*/}
            {/*  />*/}
            {/*</div>*/}
            <Typography
              variant="subbody"
              className="lh-22 ml-16"
            >
              Здесь будут ваши билеты
            </Typography>
          </div>
        )}
      </div>
      {tickets && tickets.length > 5 &&
        <div className="gradient pos_absolute" />
      }
    </div>
  );
}

export default GroupCardTicket;
