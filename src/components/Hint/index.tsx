import * as React from 'react';
import Tippy from '@tippy.js/react';
import { HintTypes } from 'src/components/Hint/types';
import './index.scss';
import {useCallback} from "react";

function Hint(props: HintTypes.IProps) {
  const onTippyShow = useCallback(() => {
    props.onSelectTippy && props.onSelectTippy(true);
  }, [props])
  const onTippyHide = useCallback(() => {
    props.onSelectTippy && props.onSelectTippy(false);
  }, [props])

  return (
    <Tippy
      className={props.className}
      arrow
      placement={props.placement || 'right'}
      content={props.hint}
      trigger={props.showOnClick ? 'click' : 'mouseenter'}
      theme={props.theme || 'light'}
      onShow={onTippyShow}
      onHide={onTippyHide}
    >
      <div>
        {props.children}
      </div>
    </Tippy>
  );
}

export default Hint;
