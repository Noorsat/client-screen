import {IBaseProps, IMobileViewProps} from 'src/core/components/types';

export declare namespace PopupTypes {
  export interface IProps extends IBaseProps, IMobileViewProps {
    title?: string;
    subTitle?: string;
    isCloseBtn?: () => void | boolean;
    closeBtnType?: string;
    isPrintBtn?: boolean;
    closePopup?(): void;
  }
}
