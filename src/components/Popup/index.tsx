import * as React from 'react';
import './index.scss';
import Typography from "../Typography";
import successCheckmark from "../../assets/images/success-chekmark.png";
import Image from "../Image";
import Button from "../Button";
import { PopupTypes } from "./types";

export const Popup = (props: PopupTypes.IProps) => {
  const { title, subTitle, isPrintBtn, isCloseBtn, closeBtnType, closePopup } = props;
  return (
    <>
      <div className="popup-overlay" />
      <div className="popup d-flex flex-column align-items-center">
        <Typography
          variant="bodybold"
          className="color_black"
        >
          {title}
        </Typography>
        <div className="popup__img d-flex justify-content-center">
          <Image
            className="fill"
            src={successCheckmark}
            alt="successCheckmark"
          />
        </div>
        <Typography
          variant="body"
          className="color_black"
        >
          {subTitle}
        </Typography>
        {isPrintBtn && (
          <Button
            color="red"
            className="mt-3 popup__btn"
          >
            Печать билета
          </Button>
        )}
        {isCloseBtn && (
          <>

            <Typography
              variant="bodybold"
              className="color_black"
            >
              Оплата произведена?
            </Typography>

            <div className="popup-info-btn">
              <Button
                type={closeBtnType ?? 'transparent'}
                color={closeBtnType === 'red' ? 'red' : undefined}
                className="mt-8 popup__btn"
                onClick={closePopup}
              >
                Да
              </Button>
              <Button
                type={closeBtnType ?? 'transparent'}
                color={closeBtnType === 'red' ? 'red' : undefined}
                className="mt-8 popup__btn"
                onClick={isCloseBtn}
              >
                Нет
              </Button>
            </div>
          </>

        )}
      </div>
    </>
  );
};
