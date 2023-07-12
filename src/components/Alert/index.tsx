import * as React from 'react';
import classNames from 'classnames';
import { AlertTypes } from 'src/components/Alert/types';
import Button from 'src/components/Button';
import './index.scss';

function Alert(props: AlertTypes.IProps) {
  const { message, cancelLabel, confirmLabel, onCancel, onConfirm, maxWidth, withNoBackground } = props;

  const onCancelClick = () => {
    onCancel && onCancel();
  };

  const onConfirmClick = () => {
    onConfirm && onConfirm();
  };

  return (
    <>
      <div
        className="alert-overlay"
        onClick={onCancelClick}
      />
      <div
        className={classNames(['alert d-flex flex-column', { color_white__bg : !withNoBackground }])}
        style={{ maxWidth }}
      >
        <div className="alert__message">
          {message}
        </div>
        <div className={classNames('alert__buttons mt-24 ml-0 ml-md-auto d-flex flex-column-reverse flex-md-row justify-content-center', {
          'justify-content-end': !cancelLabel,
        })}>
          {cancelLabel && (
            <Button
              type="transparent"
              className="alert__button alert__button--cancel mr-16"
              onClick={onCancelClick}
            >
              {cancelLabel}
            </Button>
          )}
          {confirmLabel && (
          <Button
            type="red"
            className="alert__button alert__button--confirm mb-16 mb-md-0"
            onClick={onConfirmClick}
          >
            {confirmLabel}
          </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default Alert;
