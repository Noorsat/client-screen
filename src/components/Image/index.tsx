import React, { BaseSyntheticEvent, SyntheticEvent } from 'react';
import { mapPropsToAttributes } from 'src/core/components';
import { fallbackImage, ImageTypes } from 'src/components/Image/types';
import './index.scss';

function Image(props: ImageTypes.IProps) {
  const { src, onClick, loading } = props;
  const fallback = props.fallbackImage || fallbackImage;

  const onError = (event: SyntheticEvent<HTMLImageElement> | BaseSyntheticEvent<HTMLImageElement>) =>
    event.target.setAttribute('src', fallback);

  return (
    <img
      {...mapPropsToAttributes(props, 'image', { 'covered': loading })}
      src={src || fallback}
      onClick={onClick}
      onError={onError}
      alt={`${props.alt} - kinopark.kz`}
      title={props.alt || '' }
    />
  );
}

export default Image;
