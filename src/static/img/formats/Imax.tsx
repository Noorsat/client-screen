import React from 'react';
import { defaultSVGColor, FormatTypes } from 'src/static/img/formats/types';
import { Link } from 'react-router-dom';
import ConditionalWrap from 'src/components/ConditionalWrap';

function Imax(props: FormatTypes.IProps) {
  const { className, link } = props;
  const color = props.color || defaultSVGColor;

  return (
    <ConditionalWrap
      condition={!!link}
      wrap={children => <Link to="/company/technologies/imax">{children}</Link>}
    >
      <svg
        className={className}
        style={{ cursor : 'pointer' }}
        xmlns="http://www.w3.org/2000/svg"
        width="65"
        height="12"
        fill="none"
        viewBox="0 0 65 12"
      >
        <g clipPath="url(#clip0)">
          <path
            fill={color}
            d="M9.86 11.96l.005-8.603h.626l4.202 8.594h2.718l4.202-8.59.663-.013-.023 8.612h3.362L25.605.2l-5.87.018-3.683 6.92L12.564.208 6.507.227 6.498 11.96H9.86zM3.986 0H0v11.964h3.986V0zM32.375.161l-6.008 11.8L30.15 12l1.187-2.118 7.458-.04 1.036 2.08 3.935.039L37.76.16h-5.384zm2.676 2.525l2.518 4.605-4.86.033 2.342-4.638zM49.52.198l-4.434.026 4.564 5.378-5.535 6.35 4.748.026 3.883-4.33 3.7 4.33 4.905-.027-5.535-6.322L60.354.25 55.79.172l-3.043 3.804L49.52.198zM62.043 1.705h.437c.156 0 .268-.025.334-.076s.099-.135.099-.252a.32.32 0 00-.032-.143.25.25 0 00-.087-.101.3.3 0 00-.11-.045 1.175 1.175 0 00-.213-.013h-.428v.63zm-.214.974V.883h.61c.135 0 .235.006.298.017.064.012.12.031.166.058.074.041.13.098.17.17.04.072.06.154.06.244a.508.508 0 01-.078.285.32.32 0 01-.205.145c.065.01.115.043.148.096.034.053.057.155.07.308l.022.263c.003.038.009.07.017.094a.132.132 0 00.04.058v.059h-.222a.356.356 0 01-.033-.09.834.834 0 01-.015-.112l-.02-.231c-.012-.155-.038-.251-.078-.29-.04-.04-.124-.06-.253-.06h-.483v.783h-.214z"
          />
          <path
            stroke={color}
            strokeWidth="0.1"
            d="M64.024 1.808a1.575 1.575 0 11-3.15 0 1.575 1.575 0 013.15 0z"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <path fill="#fff" d="M0 0H64.129V12H0z" />
          </clipPath>
        </defs>
      </svg>
    </ConditionalWrap>
  );
}

export default Imax;
