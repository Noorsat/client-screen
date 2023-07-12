import * as React from 'react';
import classNames from 'classnames';
import { DropdownItemTypes, DropdownTypes, iconCaredDown, iconCaredDownBlack } from 'src/components/Dropdown/types';
import Checkbox from 'src/components/Checkbox';
import Button from 'src/components/Button';
import Typography from 'src/components/Typography';
import Image from 'src/components/Image';
import Hint from 'src/components/Hint';
import ConditionalWrap from 'src/components/ConditionalWrap';
import './index.scss';

class Dropdown extends React.Component<DropdownTypes.IProps, DropdownTypes.IState> {
  constructor(props: DropdownTypes.IProps) {
    super(props);
    this.state = {
      isListOpen : this.props.isListOpen || false,
      currentTitle: this.props.title,
      currentLang: '',
      list: [
        ...this.setActive(this.props.listNode, this.props.title),
      ],
    };
    this.setActive = this.setActive.bind(this);
    this.toggleList = this.toggleList.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<DropdownTypes.IProps>) {
    if (prevProps.isListOpen !== this.props.isListOpen) {
      this.setState({
        isListOpen: this.props.isListOpen || false,
        currentTitle: this.props.title,
        list: [...this.setActive(this.props.listNode, this.props.title)],
      });
    }
    if (prevProps.listNode !== this.props.listNode) {
      this.setState({
        list: [...this.setActive(this.props.listNode, this.props.title)],
      });
    }
    if (prevProps.title !== this.props.title) {
      this.setState({
        currentTitle: this.props.title,
        list: [...this.setActive(this.props.listNode, this.props.title)],
      });
    }
    if (prevProps.selectedDay !== this.props.selectedDay) {
      this.setState({
        currentLang: '',
      });
    }
    if (prevProps.selectedTime !== this.props.selectedTime) {
      if (this.props.title === 'More' || this.props.title === 'Еще' || this.props.title === 'Тағы') {
        this.setState({
          currentLang: '',
        });
      }
    }
  }

  public setActive(listNode: DropdownItemTypes.IProps[], title: string):DropdownItemTypes.IProps[] {
    listNode.map((item) => { item.title === title ? item.active = true : item.active = false; });
    return listNode;
  }

  public handleClickOutside = () => {
    this.setState({ isListOpen: false }, () => {
      document.removeEventListener('click', this.handleClickOutside);
    });
  }

  public toggleList(event: any) {
    event.preventDefault();
    this.setState({ isListOpen: true }, () => {
      document.addEventListener('click', this.handleClickOutside);
    });
  }

  public toggleSelected = (title: string, id: string, lang?: string) => () => {
    const list = [...this.state.list];
    list.map((item) => {
      if (item.id === id) {
        item.active = true;
        this.props.onSelectOption && this.props.onSelectOption(item);
      } else {
        item.active = false;
      }
    });

    this.setState({
      list: [...list],
      currentTitle: title,
      currentLang: lang,
      isListOpen: false,
    });
  }

  render(): React.ReactNode {
    const {
      showFirstCharacters,
      titleButtonColor,
      titleButtonType,
      isTitleButtonFlat,
      variantTitleButton,
      icon,
      imgSrc,
      className,
      minWidth,
      isPaddingRemoved,
      underline,
      isLabelHidden,
      isCheckbox,
      loading,
      isMobileView,
      fullWidth,
      staticTitle,
      isHaveFlag,
      titleColor,
      bigPadding,
    } = this.props;

    const {
      isListOpen,
      currentTitle,
      currentLang,
      list,
    } = this.state;
    return (
      <div className={classNames(['dd pos_relative', className])}>
        <Button
          className={classNames(
            'dd__button-title d-flex align-items-center',
            { 'p-0': isPaddingRemoved },
            { 'dd__button-title--underlined pb-4': underline },
            { 'dd__button-title--label-hidden': isLabelHidden },
            { 'dd__button-title--big-padding': bigPadding },
            { fill_w: fullWidth },
          )}
          type={titleButtonType}
          flat={isTitleButtonFlat}
          color={!isListOpen && isTitleButtonFlat ? 'black' : titleButtonColor}
          onClick={this.toggleList}
        >
          {/*{icon && (*/}
          {/*  <Image*/}
          {/*    src={icon}*/}
          {/*    alt="dropdown icon"*/}
          {/*    className={classNames('dd__button-title__icon--left', {*/}
          {/*      'mr-8': !isLabelHidden,*/}
          {/*    })}*/}
          {/*  />*/}
          {/*)}*/}
          {imgSrc && (
           <Image
             src={imgSrc}
             alt="dd__button-title__img drop down custom image"
             className="my-auto"
           />
          )}
          {!isLabelHidden && (
            <>
              <div className="d-flex align-items-center dd__button-title__content mr-8">
                {currentLang && currentLang === 'kaz' &&
                  <Image
                    src="/static/img/icons/kz_d.png"
                    alt="flag"
                    className="dd__button-title__content__img"
                  />
                }
                {currentLang && currentLang === 'eng' &&
                  <Image
                    src="/static/img/icons/eng_d.png"
                    alt="flag"
                    className="dd__button-title__content__img"
                  />
                }
                <Typography
                  variant={variantTitleButton || 'body'}
                  className={classNames(
                    'dd__button-title__content__label',
                    titleColor ? `color_${titleColor}` : '',
                    { covered: loading },
                  )}
                >
                  {staticTitle || (showFirstCharacters ? currentTitle.slice(0, showFirstCharacters) : currentTitle)}
                </Typography>
              </div>
              <Image
                src={titleColor === 'black' ? iconCaredDownBlack : iconCaredDown}
                alt="cared-down"
                className={classNames(
                  'dd__button-title__icon ml-auto',
                  { 'dd__button-title__icon--open': isListOpen },
                )}
              />
            </>
          )}
        </Button>
        {isListOpen &&
        <ul
            className={classNames([
              'dd-list pos_absolute color_white__bg color_black',
              list.length > 9 && 'dd-list--scroll',
              list.length < 1 && 'd-none',
            ])}
            style={{ minWidth }}
        >
          {list.map(item =>
            <li
              key={item.id}
              className={classNames('dd-list__item', {
                'dd-list__item--disabled': item.disabled,
              })}
              onClick={item.disabled ? undefined : this.toggleSelected(item.title, item.id, item.languageForFlag)}
            >
              <ConditionalWrap
                condition={!!item.hint}
                wrap={children => (
                  <Hint
                    hint={
                      <>{item.hint}</>
                    }
                  >
                    {children}
                  </Hint>
                )}
              >
                <div>
                  {item.languageForFlag && item.languageForFlag === 'kaz' &&
                    <Image
                      src="/static/img/icons/kz_4.png"
                      alt="flag"
                      className="dropdown_img"
                    />
                  }
                  {item.languageForFlag && item.languageForFlag === 'eng' &&
                    <Image
                      src="/static/img/icons/eng_4.png"
                      alt="flag"
                      className="dropdown_img"
                    />
                  }
                  { isHaveFlag ?
                    <Button
                      flat
                      variant={isMobileView ? 'subbody' : 'body'}
                      className={classNames(
                        'dd-list__item-btn fill_w py-8 text-left lh-28',
                        { 'dd-list__item-btn--active': item.active && !isLabelHidden },
                      )}
                    >
                      {isCheckbox && <Checkbox isClicked={item.active} />}
                      {item.title}
                    </Button> :
                    <Button
                      flat
                      variant={isMobileView ? 'subbody' : 'body'}
                      className={classNames(
                        'dd-list__item-button fill_w py-8 text-left lh-28 d-flex align-items-center',
                        { 'dd-list__item-button--active': item.active && !isLabelHidden },
                      )}
                    >
                      {isCheckbox && <Checkbox isClicked={item.active} />}
                      {item.title}
                    </Button>
                  }
                </div>
              </ConditionalWrap>
            </li>)}
        </ul>
        }
      </div>
    );
  }
}

export default Dropdown;
