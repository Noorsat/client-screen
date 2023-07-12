import { IBaseProps } from 'src/core/components/types';

export namespace AlertTypes{
  export interface IProps extends IBaseProps {
    message: JSX.Element;
    confirmLabel?: string;
    maxWidth?: number;
    withNoBackground?: boolean;
    cancelLabel?: string;
    onCancel?(): void;
    onConfirm?(): void;
  }
}
