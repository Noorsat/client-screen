import * as React from 'react';
import CardTicket from 'src/components/CardTicket/index';
import { GroupCardTicketTypes } from 'src/components/CardTicket/types';
import { ITicket } from 'src/core/components/types';
import './index.scss';

function GroupCardTicketMobile(props: GroupCardTicketTypes.IProps): JSX.Element {
  const tickets = props.tickets || [];

  const onChangeTariff = (ticket: ITicket) => (tariffLabel: string, price: number) => {
    props.onChangeTariff && props.onChangeTariff(ticket, tariffLabel, price);
  };

  return (
    <div className="pos_relative">
      <div className="group-card-ticket pos_relative">
        {tickets.map((n: ITicket, i) => (
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
        ))}
      </div>
    </div>
  );
}

export default GroupCardTicketMobile;
