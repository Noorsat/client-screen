import * as React from 'react';
import Button from 'src/components/Button';
import Image from 'src/components/Image';
import { chevronDown, ScrollButtonTypes } from 'src/components/ScrollButton/types';
import { mapPropsToAttributes } from 'src/core/components';

function ScrollButton(props: ScrollButtonTypes.IProps) {
  const scrollToPosition = () => {
    // eslint-disable-next-line no-restricted-globals
    scrollToCoords && scrollTo(scrollToCoords.x, scrollToCoords.y);
  };
  const { to, arrowDirection, scrollToCoords } = props;
  return (
    <Button
      {...mapPropsToAttributes(
        props,
        'scroll-button pos_absolute p-0',
        props.isScrollButtonHidden ? 'scroll-button--fade-out' : 'scroll-button--fade-in',
      )}
      href={to}
      onClick={scrollToCoords ? scrollToPosition : undefined}
    >
      <Image
        src={chevronDown}
        alt="scroll button"
        classNames={['scroll-button_i', arrowDirection === 'down' ? 'scroll-button_i--down' : 'scroll-button_i--up']}
      />
    </Button>
  );
}

export default ScrollButton;
