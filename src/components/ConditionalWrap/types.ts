export namespace ConditionalWrapTypes {
  export interface IProps {
    condition: boolean;
    children: JSX.Element;
    wrap(children: JSX.Element): JSX.Element;
  }
}
