import React from 'react';
import { defaultSVGColor, FormatTypes } from 'src/static/img/formats/types';

function Seat(props: FormatTypes.IProps) {
  const { className } = props;
  const color = props.color || defaultSVGColor;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="27"
      fill={color}
      viewBox="0 0 35 27"
    >
      <g mask="url(#a)">
        <path
          fill={color}
          d="M30.898 10.679h-1.367V5.512c0-3.04-2.453-5.512-5.468-5.512H10.938c-3.016 0-5.47 2.472-5.47 5.512v5.167H4.103C1.84 10.679 0 12.533 0 14.813v8.06c0 2.28 1.84 4.134 4.102 4.134h12.03v5.512H9.298v2.756h16.406v-2.756h-6.836v-5.512h12.031c2.262 0 4.102-1.854 4.102-4.133v-8.061c0-2.28-1.84-4.134-4.102-4.134zM26.797 24.25H8.203v-1.515c0-.76.613-1.378 1.367-1.378h15.86c.753 0 1.367.618 1.367 1.378v1.515zM10.937 2.756h13.126c1.507 0 2.734 1.236 2.734 2.756v13.327a4.05 4.05 0 00-1.367-.237H9.57c-.479 0-.939.084-1.367.237V5.512c0-1.52 1.227-2.756 2.735-2.756zM2.735 22.874v-8.061c0-.76.614-1.378 1.368-1.378h1.367V24.25H4.102a1.374 1.374 0 01-1.368-1.377zm29.532 0c0 .76-.614 1.378-1.368 1.378h-1.367V13.434h1.367c.754 0 1.368.618 1.368 1.378v8.06z"
        />
      </g>
    </svg>
  );
}

export default Seat;
