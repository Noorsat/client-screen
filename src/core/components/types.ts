import { AntAnchor } from 'antd/lib/anchor/Anchor';
import { CSSProperties, DOMAttributes } from 'react';
import { HallMapReducerTypes } from 'src/store/hallMap/types';

export type ClassNames = string | boolean | object | any[];

/**
 * Base attributes of any tag.
 */
export interface IBaseAttributes {
  /**
   * Tags id.
   */
  id?: string;
  /**
   * Tags role.
   */
  role?: string;
  /**
   * Tags style.
   */
  style?: CSSProperties;
  /**
   * Tags class name.
   */
  className?: string;
  /**
   * data-tip is necessary, because <ReactTooltip /> finds the tooltip via this attribute
   */
  'data-tip'?: boolean;
  /**
   * data-for corresponds to the id of <ReactTooltip />
   */
  'data-for'?: string;
}

/**
 * Props of the component that supports ripples.
 */
export interface IRippleProps {
  /**
   * Indicates if component needs to be rippled.
   */
  ripple?: boolean;
}

/**
 * Props of the component that supports covers.
 */
export interface ICoverProps {
  /**
   * Indicates if component needs to be covered.
   */
  covered?: boolean;
  /**
   * Indicates if component needs to be disabled.
   */
  disabled?: boolean;
}

/**
 * Props of the component that implements Preloader.
 */
export interface ILoadingProps {
  /**
   * Indicates if component needs to be covered by Preloader.
   */
  loading?: boolean;
}

/**
 * Static components base props.
 */
export interface IBaseProps extends IBaseAttributes {
  /**
   * Component wrappers classNames.
   */
  classNames?: ClassNames;
}

/**
 * props for detection mobile device.
 */
export interface IMobileViewProps {
  isMobileView?: boolean;
}

/**
 * Props of the component that supports highlight.
 */
export interface IHighlightTypes {
  highlight?: string;
}

/**
 * Standard html base components.
 */
export interface IBaseAttributeProps<T extends Element> extends DOMAttributes<T>, IBaseProps {
}

/**
 * The main props of ticket
 */
export interface ITicket {
  id: string;
  type: string;
  price: number;
  seat: ISeat;
  discountId: string;
}

/**
 * The main props of seat
 */

type SeatsSeats = {
  id: string;
}

export interface ISeat {
  id: string;
  seatRow: number;
  seatCol: number;
  status: number;
  rowText: string;
  colText: string;
  label?: string;
  name: string;
  seatType?: HallMapReducerTypes.IHallZoneType;
  zoneId?:number,
  zoneColor?:string,
  zoneName?:string,
  loveSeatReference?:any | undefined;
  ticket: {
    cashier:any
    id: string;
    number: string;
    seats: Array<SeatsSeats>;
  } | any
}

export interface IMetatags {
  metaTags?: IMetatag;
}

export interface IMetatag {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  movieMetaTags?: IMovieMetaTag;
  robots?: string;
}

interface IMovieMetaTag {
  name?: string;
  alternativeHeadline?: string;
  description?: string;
  image?: string;
  duration?: number;
  dateCreated?: string;
  director?: string;
  ratingValue?: string;
}

declare global {
  interface Window { GA_INITIALIZED: boolean; }
}

export interface IDataParams {
  data: any;
  loading?: boolean;
  errorMessage?: { message: string, status: number };
}
