import * as React from 'react';
import { mapPropsToAttributes } from 'src/core/components';
import screenImg from 'src/assets/images/screen.svg';
import { SkeletonHallMapTypes } from 'src/components/Skeleton/types';
import './index.scss';

function SkeletonHallMap(props: SkeletonHallMapTypes.IProps) {
  const attributes = mapPropsToAttributes<SkeletonHallMapTypes.IProps>(props, 'skeleton-hall-map d-flex flex-column align-items-center');
  const col = 16;
  const row = 8;
  return (
    <div {...attributes}>
      <img
        src={screenImg}
        alt="screen"
        className="skeleton-hall-map__screen"
      />
      {[...Array(row)].map((_, i: number) => (
        <div key={i} className="d-flex">
          {[...Array(col)].map((_, j: number) => (
            <div
              key={`${i}_${j}`}
              className="skeleton-hall-map__item covered"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SkeletonHallMap;
