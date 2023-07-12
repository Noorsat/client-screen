export namespace CheckboxTypes {
  export interface IProps {
    title?: string;
    subTitle?: string;
    isClicked?: boolean;
    disabled?: boolean;
    setClicked?(state: boolean): void;
  }
  export interface IState {
    checked: boolean;
  }
}
