import * as React from 'react';
import { mapPropsToAttributes } from 'src/core/components';
import { ButtonTypes } from 'src/components/Button/types';
import './index.scss';

/**
 * Button represents default html <button>, <a> tags and
 * next/link component, but with styles
 */
export default class Button extends React.Component<ButtonTypes.IProps> {
  public render(): React.ReactNode {
    const {
      children,
      // Link attributes.
      href, target,
      // Button attributes.
      buttontype = 'button',
      // Modifiers.
      color,
      variant,
      flat,
      outlined,
      cropped,
      underlined,
      type,
      fullHeight,
      noneBorderRadius,
      disabled,
      // Events.
      onClick, onChange, onDoubleClick,
      onMouseEnter,
    } = this.props;
    const attributes = mapPropsToAttributes<ButtonTypes.IProps>(this.props, 'button', {
      'button--flat': flat,
      'button--outlined': outlined,
      'button--underlined': underlined,
      'button--cropped': cropped,
      'button--border-radius-none': noneBorderRadius,
      [`button--color-${color}`]: color,
      [`typography__variant-${variant}`]: variant,
      [`button--type-${type}`]: type,
      'fill_h py-12': fullHeight,
    });

    return href ?
      <a
        {...attributes}
        href={href}
        target={target}
        onClick={onClick as any}
        onMouseEnter={onMouseEnter as any}
      >{children}</a> :
      <button
        {...attributes}
        disabled={disabled}
        {...{
          onClick, onChange, onDoubleClick, buttontype,
          onMouseEnter
        }}
      >{children}</button>
  }
}
