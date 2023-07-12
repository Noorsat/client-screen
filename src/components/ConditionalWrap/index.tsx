import * as React from 'react';
import { ConditionalWrapTypes } from 'src/components/ConditionalWrap/types';

function ConditionalWrap(props: ConditionalWrapTypes.IProps){
  const { condition, wrap, children } = props;
  return (
    condition ? wrap(children) : <>{children}</>
  );
}

export default ConditionalWrap;
