import { useEffect } from 'react';
import Hint from 'src/components/Hint';
import Typography from 'src/components/Typography';
import './index.scss';
import { BottomPanelTypes } from "./types";
import classNames from "classnames";
import { ReactChild, ReactFragment, ReactPortal, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setOpenModal } from 'src/store/modal/modalSlice';
import { unlockSeat } from 'src/store/ticket';
import * as io from "socket.io-client";
const socket = io.connect('localhost:5000');

export default function BottomPanel(props: BottomPanelTypes.IProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isBasketOpen, discounts, selectedTickets } = props;

  const side = localStorage.getItem("side")

  const onCancelClick = () => {
    let seats = selectedTickets.map(item => item.id);
    const user_id = localStorage.getItem("userID");
    const body = {
      seats: seats,
      cashier_id: user_id
    }
    unlockSeat(body, window.location.pathname.split("/").reverse()[0])
    navigate('/');
    socket.emit('toMainPage')
  }

  const onNavigateMainPage = () => {
    navigate('/');
    socket.emit('toMainPage')
  }

  return (
    <div className={classNames('footer_block', isBasketOpen && 'footer_block--mini')}>
      <div className="bottom_panel">
        <div className="panel_item">
          <a onClick={() => dispatch(setOpenModal(true))}>Все брони</a>
        </div>

        <div className="panel_item">
          <Hint
            showOnClick
            theme={'white'}
            hint={
              <div className="d-flex flex-column py-16 px-12">
                <Typography
                  variant="bodybold"
                  className="text-left ml-8"
                >
                  Тарифы
                </Typography>
                <ul>
                  {
                    discounts?.map((discount: any) => (
                      <li>
                        <Typography
                          variant="subbody"
                          className=""
                        >
                          {discount?.name} - {discount?.value}
                        </Typography>
                      </li>
                    ))
                  }
                </ul>
              </div>
            }
          >
            <a>Тарифы</a>
          </Hint>
        </div>

        <div onClick={onNavigateMainPage}>
          <div className="panel_item">
            <a>Репертуар</a>
          </div>
        </div>

        <div className="panel_item" onClick={onCancelClick}>
          <a>&#10005; Отмена покупки</a>
        </div>
      </div>
    </div>
  )
}
