import * as React from 'react';
import { mapPropsToAttributes } from 'src/core/components';
import { LoadingTypes } from './types';
import './index.scss';

function Loading(props: LoadingTypes.IProps): JSX.Element {
  return React.createElement(
    'div',
    mapPropsToAttributes<LoadingTypes.IProps>(props, 'loading', {
      [`loading__size-${props.size}`]: props.size,
      [`loading__color-${props.color}`]: props.color,
      [`loading__border-size-${props.spinnerSize}`]: props.spinnerSize,
    }));
}

export default Loading;
