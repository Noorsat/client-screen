import * as React from 'react';
import './index.scss';
import Button from "../Button";
import Typography from "../Typography";
import Checkbox from "../Checkbox";
import Image from "../Image";

type Props = {

};
export const TicketModal = (props: Props) => {
  return (
    <div className="ticket-modal">
      <div className="ticket-modal__content">
        <div className="d-flex justify-content-between">
          <Typography
            variant="h3"
            className=""
          >
            Король Лев
          </Typography>
          <Button
            type="transparent"
            className="ticket-modal__close-btn p-0"
            variant="body"
          >
            Закрыть X
          </Button>
        </div>
        <Typography
          variant="subbody"
          className="w-100 text-left"
        >
          IMAX
        </Typography>
        <div className="d-flex mt-2">
          <div className="d-flex flex-column mr-24">
            <Typography
              variant="subbody"
              className=""
            >
              Дата и время
            </Typography>
            <Typography
              variant="bodybold"
              className=""
            >
              15 марта, 18:00
            </Typography>
          </div>
          <div className="d-flex flex-column">
            <Typography
              variant="subbody"
              className=""
            >
              Кинотеатр
            </Typography>
            <Typography
              variant="bodybold"
              className=""
            >
              Kinopark 8 Moskva
            </Typography>
          </div>
        </div>
        <div className="d-flex flex-column mt-12">
          <Typography
            variant="subbody"
            className=""
          >
            Зал
          </Typography>
          <Typography
            variant="bodybold"
            className=""
          >
            Зал 1 IMAX
          </Typography>
        </div>
        <div className="d-flex flex-column mt-12">
          <Typography
            variant="subbody"
            className=""
          >
            Ваши места
          </Typography>
          <Typography
            variant="bodybold"
            className=""
          >
            6 ряд, 18 место (студенческий билет)
          </Typography>
          <Typography
            variant="bodybold"
            className=""
          >
            6 ряд, 19 место (взрослый билет)
          </Typography>
          <Typography
            variant="bodybold"
            className=""
          >
            6 ряд, 20 место (VIP)
          </Typography>
        </div>
        <div className="d-flex mt-16">
          <div className="d-flex flex-column mr-24">
            <Typography
              variant="subbody"
              className=""
            >
              Сумма оплаты
            </Typography>
            <Typography
              variant="bodybold"
              className=""
            >
              3500 тг
            </Typography>
          </div>
          <div className="d-flex flex-column">
            <Typography
              variant="subbody"
              className=""
            >
              Номер билета
            </Typography>
            <Typography
              variant="bodybold"
              className=""
            >
              123123123
            </Typography>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <Image
            className="fill_w ticket-modal__content__qr"
            src={'data:image/png;base64,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'}
            alt="qrCode"
          />
          <Typography
            variant="caption"
            className=""
          >
            Отсканируйте QR-код у входа в зал
          </Typography>
        </div>
        <div className="d-flex flex-column mt-12">
          <Typography
            variant="subbody"
            className=""
          >
            Тип оплаты
          </Typography>
          <div className="d-flex">
            <Typography
              variant="bodybold"
              className="mr-16"
            >
              Наличный расчет
            </Typography>
            <Checkbox isClicked={false} />
          </div>
          <div className="d-flex">
            <Typography
              variant="bodybold"
              className="mr-16"
            >
              Банковская карта
            </Typography>
            <Checkbox isClicked={true} />
          </div>
          <div className="d-flex">
            <Typography
              variant="bodybold"
              className="mr-16"
            >
              По договору
            </Typography>
            <Checkbox isClicked={false} />
          </div>
        </div>
        <div className="d-flex flex-column align-items-center w-100 mt-12">
          <Button
            type="red"
            className="color-red w-75"
          >
            Продать
          </Button>
          <Button
            type="transparent"
            className="mt-8 w-75"
          >
            Снять бронь
          </Button>
        </div>
      </div>
    </div>
  );
};
