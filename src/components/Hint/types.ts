import { IBaseProps } from 'src/core/components/types';
import { Placement } from 'tippy.js';

export namespace HintTypes {
  export interface IProps extends IBaseProps {
    hint: JSX.Element;
    children: JSX.Element;
    theme?: string;
    showOnClick?: boolean;
    placement?: Placement;
    onSelectTippy?: (selected: boolean) => void;
  }
}
