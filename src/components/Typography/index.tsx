import * as React from 'react';
import { mapPropsToAttributes } from 'src/core/components';
import { IBaseAttributes } from 'src/core/components/types';
import { eraseFromObject } from 'src/utils/serialization';
import { ITypographyProps, TypographyVariants } from 'src/components/Typography/types';

function Typography(props: ITypographyProps): JSX.Element {
  return React.createElement<IBaseAttributes>(
    // @ts-ignore
    props.element ? props.element : TypographyVariants[props.variant] || TypographyVariants.body,
    {
      ...eraseFromObject(props, 'variant', 'mobileVariant', 'classNames', 'element', 'covered'),
      ...mapPropsToAttributes<ITypographyProps>(props, 'typography', {
        [`typography__variant-${props.variant}`]: props.variant,
        [`typography__variant-mobile-${props.mobileVariant}`]: props.mobileVariant,
      }),
    },
    props.children);
}

export default Typography;
