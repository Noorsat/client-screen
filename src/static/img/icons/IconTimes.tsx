import React from 'react';
import { FormatTypes } from 'src/static/img/formats/types';

function IconTimes(props: FormatTypes.IProps) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      viewBox="0 0 30 30"
      onClick={props.onClick}
    >
      <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="6" y="6" width="18" height="18">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2578 15L23.144 10.1138C23.7437 9.51416 23.7437 8.54199 23.144 7.9419L22.0581 6.85596C21.4585 6.25635 20.4863 6.25635 19.8862 6.85596L15 11.7422L10.1138 6.85596C9.51416 6.25635 8.54199 6.25635 7.94189 6.85596L6.85596 7.9419C6.25635 8.54151 6.25635 9.51367 6.85596 10.1138L11.7422 15L6.85596 19.8862C6.25635 20.4858 6.25635 21.458 6.85596 22.0581L7.94189 23.144C8.5415 23.7437 9.51416 23.7437 10.1138 23.144L15 18.2578L19.8862 23.144C20.4858 23.7437 21.4585 23.7437 22.0581 23.144L23.144 22.0581C23.7437 21.4585 23.7437 20.4863 23.144 19.8862L18.2578 15Z" fill="currentColor"/>
      </mask>
      <g mask="url(#mask0)">
        <rect width="30" height="30" fill="currentColor"/>
      </g>
    </svg>
  );
}

export default IconTimes;
