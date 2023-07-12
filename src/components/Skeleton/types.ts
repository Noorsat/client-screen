import { IBaseProps, IMobileViewProps } from 'src/core/components/types';

export namespace SkeletonTypes {
  export interface IProps extends IBaseProps {
    isSlider?: boolean;
    size?: number;
    minified?: boolean;
    /**
     * changes gap between skeletone to 16px
     */
    isGrid?:boolean;
    isNew?:boolean;
  }
}

export namespace SkeletonHallMapTypes {
  export interface IProps extends IBaseProps {
  }
}

export namespace SkeletonAdvertisingSliderTypes {
  export interface IProps extends IBaseProps {
  }
}

export namespace SkeletonTopMovieSliderTypes {
  export interface IProps extends IBaseProps, IMobileViewProps {
  }
}

export namespace SkeletonTicketsWithVideoTypes {
  export interface IProps extends IBaseProps, IMobileViewProps {
  }
}
