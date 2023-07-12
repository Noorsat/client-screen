import * as React from 'react';
import classNames from 'classnames';
import { SkeletonTypes } from 'src/components/Skeleton/types';
import { mapPropsToAttributes } from 'src/core/components';
import './index.scss';

function Skeleton(props: SkeletonTypes.IProps) {
  const { size, minified, isSlider, isGrid, isNew } = props;
  const sizeComposer = (size: number) => {
    if (size) {
      return size;
    }
    return 5;
  };
  const attributes = mapPropsToAttributes<SkeletonTypes.IProps>(props, 'skeleton-group d-flex', {
    'skeleton-group--minified': minified,
    'skeleton-group--slider': isSlider,
    'skeleton-group__item-grid': isGrid,
    'skeleton-group--new d-flex justify-content-between': isNew,
  });
  return (
    <div {...attributes}>
      {[...Array(sizeComposer(size || 0))].map((_, i: number) => (
        <div
          key={i}
          className={classNames(['skeleton-group__item covered', {
            'skeleton-group__item--minified' : minified,
            'skeleton-group__item-grid': isGrid,
            'skeleton-group__item-new': isNew,
          }])}
        />
      ))}
    </div>
  );
}

export default Skeleton;
