import { IBaseAttributeProps, ICoverProps } from 'src/core/components/types';

export interface ITypographyProps extends IBaseAttributeProps<
  HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLElement
  >, ICoverProps {
  /**
   * Any existing variant of the typography.
   */
  variant: TypographyVariants | string;
  mobileVariant?: TypographyVariants | string;
  /**
   * Specific element that will be used to create typography.
   */
  element?: string;
}

/**
 * Typed typography variants
 * that currently implemented in typography.scss.
 */
export enum TypographyVariants {
  'h1' = 'h1',
  'h2' = 'h2',
  'h3' = 'h3',
  'h1light' = 'h3',
  'h2light' = 'h2',
  'h3reg' = 'h3',
  'body' = 'p',
  'bodybold' = 'span',
  'subbody' = 'span',
  'subbodybold' = 'span',
  'caption' = 'span',
  'captionbold' = 'span',
}
