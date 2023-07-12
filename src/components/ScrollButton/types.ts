import { IBaseProps } from 'src/core/components/types';

export declare namespace ScrollButtonTypes {
  export interface IProps extends IBaseProps {
    isScrollButtonHidden?: boolean;
    arrowDirection: 'up' | 'down';
    to?: string;
    scrollToCoords?: {x: number, y: number};
  }
}

export const chevronDown = 'src/static/img/icons/chevronDown.svg';
