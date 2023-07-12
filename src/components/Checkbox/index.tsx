import * as React from 'react';
import Typography from 'src/components/Typography';
import { CheckboxTypes } from './types';
import './index.scss';

class Checkbox extends React.Component<CheckboxTypes.IProps, CheckboxTypes.IState> {
  constructor(pros: CheckboxTypes.IProps) {
    super(pros);
    this.state = {
      checked: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  public handleChange() {
    this.setState({ checked: !this.state.checked }, () => {
      this.props.setClicked && this.props.setClicked(this.state.checked);
    });
  }

  public render(): JSX.Element {
    const { title, subTitle, isClicked, disabled } = this.props;
    return (
      <label className="checkbox d-flex align-items-center">
        <Typography
          variant="subbody"
          className="lh-22 checkbox__title ml-8"
        >
          {title}
          {subTitle && (
            <span className="checkbox__subtitle">
              {` ${subTitle}`}
            </span>
          )}
        </Typography>
        <input type="checkbox" checked={isClicked} onChange={this.handleChange} disabled={disabled}/>
        <span className="mark" />
      </label>
    );
  }
}

export default Checkbox;
