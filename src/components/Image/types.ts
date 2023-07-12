import { IBaseAttributeProps } from 'src/core/components/types';

export declare namespace ImageTypes {
  export interface IProps extends IBaseAttributeProps<HTMLImageElement> {
    src?: string;
    loading?: boolean;
    alt: string;
    fallbackImage?: string;
  }
}

export const fallbackImage = 'src/static/img/photos/fallback.png';
