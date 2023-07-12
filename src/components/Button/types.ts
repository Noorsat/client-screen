import { TypographyVariants } from 'src/components/Typography/types';
import { IBaseAttributeProps, ICoverProps, IRippleProps } from 'src/core/components/types';

export namespace ButtonTypes {
  export interface IProps extends
    IBaseAttributeProps<HTMLButtonElement>,
    ICoverProps,
    IRippleProps {
    /**
     * If exists, will render Link component from next/link
     * with to props in it.
     */
    to?: string;
    /**
     * If exists, will render default html <a> tag with href in it.
     */
    href?: string;
    /**
     * Will be passed into <a> tag if href presented.
     */
    as?: string;
    target?: string;
    /**
     * Will be passed into <button> component if to or href props
     * not presented.
     */
    buttontype?: 'submit' | 'reset' | 'button';
    /**
     * Typography variant of buttons label.
     */
    variant?: TypographyVariants | string;
    /**
     * Sets accent color of the button.
     * Look for vars.scss in ../../../assets to see available options.
     */
    color?: string;
    /**
     * Disables any user interaction with component.
     */
    disabled?: boolean;
    /**
     * Flat will set background to zero.
     */
    flat?: boolean;
    /**
     * Removes buttons x padding and crops it as a box
     * without border radius.
     */
    cropped?: boolean;
    /**
     * Adds a line at the bottom of the button.
     */
    underlined?: boolean;
    /**
     * Same as flat, but sets border width to 2px.
     */
    outlined?: boolean;
    noneBorderRadius?: boolean;

    type?: ButtonVariants | string;

    fullHeight?: boolean;
  }

  export enum ButtonVariants {
    'red',
    'yellow',
    'transparent',
    'white',
    'light_blue',
  }
}
