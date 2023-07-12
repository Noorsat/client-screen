import { IBaseProps } from 'src/core/components/types';

export namespace LoadingTypes {
    export interface IProps extends IBaseProps {
        // Loading bar color.
      color?: string;
        // Loading size. Goes from one (1) to ten (10).
      size?: number;
        // Loading spinners width. Goes from one (1) to ten (10).
      spinnerSize?: number;
    }
}
