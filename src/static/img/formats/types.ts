import { IBaseProps } from 'src/core/components/types';

export declare namespace FormatTypes{
  export interface IProps extends IBaseProps {
    color?: string;
    className?: string;
    link?: boolean;
    onClick?(): void;
  }
}

export const defaultSVGColor = '#AAAAAA';
