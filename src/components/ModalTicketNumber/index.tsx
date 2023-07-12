import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './index.scss';
import { BsBackspace } from 'react-icons/bs';
import { Input } from 'antd';

type Props = {
  searchreservation: (value: string) => void;
  onHide: () => void;
  show: boolean;
}

export default function ModalOrder(props: Props) {
  const [numbers, setNumbers] = useState('');

  const handleInputs = (n: string) => {
    setNumbers(numbers.concat(n))
  }

  const removeLast = () => {
    setNumbers(numbers.substring(0, numbers.length - 1));
  }

  const changeTicketNumber = (e: any) => {
    setNumbers(e.target.value);
  }

  return (
    <Modal {...props}
      centered
      dialogClassName="my-modal-number"
    >
      <Modal.Body className="show-grid">
        <div className="modal-number">
          <p>Введите номер билета</p>
          <Input type="text" placeholder="00-00-00-00" className="form-control" value={numbers} onChange={(e) => changeTicketNumber(e)} />
          <div className="button-group">
            <div className="col-btn">
              <div className="order-btn" onClick={() => handleInputs('1')}>1</div>
              <div className="order-btn" onClick={() => handleInputs('2')}>2</div>
              <div className="order-btn" onClick={() => handleInputs('3')}>3</div>
            </div>
            <div className="col-btn">
              <div className="order-btn" onClick={() => handleInputs('4')}>4</div>
              <div className="order-btn" onClick={() => handleInputs('5')}>5</div>
              <div className="order-btn" onClick={() => handleInputs('6')}>6</div>
            </div>
            <div className="col-btn">
              <div className="order-btn" onClick={() => handleInputs('7')}>7</div>
              <div className="order-btn" onClick={() => handleInputs('8')}>8</div>
              <div className="order-btn" onClick={() => handleInputs('9')}>9</div>
            </div>
            <div className="col-btn">
              <div className="order-btn opacity"></div>
              <div className="order-btn" onClick={() => handleInputs('0')}>0</div>
              <div className="order-icon"><BsBackspace onClick={removeLast} /> </div>
            </div>
          </div>
          <div className="btn-search">
            <div className="btn-s" onClick={() => props.searchreservation(numbers)}>Найти</div>
          </div>
          <div className="btn-close-modal">
            <div className="btn-s" onClick={props.onHide}>Отмена</div>
          </div>
        </div>
      </Modal.Body>
    </Modal >
  );
}