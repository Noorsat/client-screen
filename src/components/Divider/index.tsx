import  React from 'react';
import { mapPropsToAttributes } from 'src/core/components';
import { DividerTypes } from 'src/components/Divider/types';
import './index.scss';

function Divider(props: DividerTypes.IProps): JSX.Element {
  return React.createElement('div', mapPropsToAttributes<DividerTypes.IProps>(props, 'divider'));
}

export default Divider;
