import Loading from 'src/components/Loading';
import { PreloaderTypes } from 'src/components/Preloader/types';

/**
 * Use this component to preloader async data.
 */
function Preloader(props: PreloaderTypes.IProps): JSX.Element {
  return props.loading ?
    <Loading {...props} /> :
    props.children ?
      props.children :
      <div />;
}

export default Preloader;
