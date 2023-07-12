import { IBaseProps, ILoadingProps } from 'src/core/components/types';

export declare namespace DropdownTypes {
  export interface IProps extends IBaseProps, IDropdownTitleModifiers, ILoadingProps {
    title: string;
    /**
     * The list of elements that we will get from parent component
     */
    staticTitle?: string;
    listNode: DropdownItemTypes.IProps[];
    /**
     * Changes style of dropdown button to underlined one
     */
    underline?: boolean;
    /**
     * hides label
     */
    isLabelHidden?: boolean;
    isMobileView?: boolean;
    /**
     * Default value that will displayed
     */
    showFirstCharacters?: number;
    onSelectOption?(option: DropdownItemTypes.IProps): void;
    isListOpen?: boolean;
    /**
     * Sets dropdown title width to 100%
     */
    fullWidth?: boolean;
    fullHeight?: boolean;
    isHaveFlag?: boolean;
    selectedDay?: DropdownItemTypes.IProps;
    selectedTime?: DropdownItemTypes.IProps;
    titleColor?: string;
    bigPadding?: boolean;
  }

  export interface IState {
    /**
     * Manipulate to show or not dropdown content, by default not(false)
     */
    isListOpen: boolean;
    /**
     * The title that will be changed according user clicking to the
     * dropdown content, by default the value of props.title
     */
    currentTitle: string;
    /**
     * The list of elements that properties will be changed
     * now only active
     */
    list: DropdownItemTypes.IProps[];
    currentLang?: string;
  }
}
/**
 * Initial modifiers for Dropdown Title
 * you can add new property but only necessary
 * also you can just use styles
 */
export interface IDropdownTitleModifiers {
  titleButtonColor?: string;
  isTitleButtonFlat?: boolean;
  variantTitleButton?: string;
  titleButtonType?: string;
  /**
   * FontAwesome icon which will be display at the left of dropdown
   */
  icon?: string;
  /**
   * FontAwesome image which will be display at the left of dropdown
   */
  imgSrc?: string;
  /**
   * Minimum width of a dropdown menu.
   */
  minWidth?: number;
  /**
   * Sets padding to zero.
   */
  isPaddingRemoved?: boolean;
  /**
   * add checkbox in option
   */
  isCheckbox?: boolean;
}

export declare namespace DropdownItemTypes {
  export interface IProps {
    /**
     * The uniq id of item
     */
    id: string;
    /**
     * The title of item that will be displayed
     */
    title: string;
    /**
     * The state that manipulate if item active
     * in the list only one active item
     */
    active?: boolean;
    /**
     * Disables the option
     */
    disabled?: boolean;
    /**
     * Shows hint on option
     */
    hint?: JSX.Element | null;
    languageForFlag?: string;
    isMobileView?: boolean;
  }
}

export const iconCaredDown = '/static/img/icons/caretDown.svg';
export const iconCaredDownBlack = '/static/img/icons/caretDownBlack.svg';
