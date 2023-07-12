import { LoadingTypes } from 'src/components/Loading/types';

export namespace PreloaderTypes {
    export interface IProps extends LoadingTypes.IProps {
        // Indicates if loading/children is visible or hidden.
      loading: boolean;
        // Children that will be displayed when loading is finished.
      children?: any;
    }
}
