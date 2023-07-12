import * as React from 'react';
import classNames from 'classnames';
import Image from 'src/components/Image';
import Typography from 'src/components/Typography';
import Preloader from 'src/components/Preloader';
import HallMapSeat from 'src/components/HallMap/HallMapSeat.index';
import { ISeat } from 'src/core/components/types';
import { HallMapTypes } from 'src/components/HallMap/types';
import { ScheduleTypes } from 'src/store/schedule/types';
import screenImg from 'src/assets/images/screen.svg';
import searchImg from 'src/assets/images/search-icon.svg';
import './index.scss';

class HallMap extends React.Component<HallMapTypes.IProps, HallMapTypes.IState> {
  constructor(props: HallMapTypes.IProps) {
    
    super(props);
    this.state = {
      rowMarkers: [],
      seatArray: this.props.seatArray,
      ticketSelectorExpanded: false,
      ticketEditorExpanded: false,
      selectedSeat: {} as ISeat,
      isZoomClicked: false,
    };
  }


  componentDidUpdate(prevProps: HallMapTypes.IProps) {
    if (this.props.seatArray !== prevProps.seatArray) {
      this.setState({
        seatArray: this.props.seatArray,
        rowMarkers: this.rowMarkersComposer(this.props.seatArray),
      });
    }
  }

  public rowMarkersComposer = (seatArray: ISeat[][]) => {
    let cnt = 0;
    return (
      seatArray.map((n: ISeat[]) => {
        if (n.some(col => col.status !== -1)) {
          cnt = cnt + 1;
          return cnt;
        }
        return -1;
      })
    );
  }

  public checkSeatAvailability(seat: ISeat, { isPerformanceAreaBottom } = this.props): boolean {
    const { rowCount, colCount } = this.props;
    const { seatArray } = this.state;
    const row = isPerformanceAreaBottom ? colCount - seat.seatRow : seat.seatRow - 1;
    const col = isPerformanceAreaBottom ? rowCount - seat.seatCol : seat.seatCol - 1;

    if (seatArray[row]) {
      const prevprevSeat = col - 2 >= 0 ? seatArray[row][col - 2].status : -1;
      const prevSeat = col - 1 >= 0 ? seatArray[row][col - 1].status : -1;
      const nextSeat = col + 1 < rowCount ? seatArray[row][col + 1].status : -1;
      const nextnextSeat = col + 2 < rowCount ? seatArray[row][col + 2].status : -1;
      return !(
        prevSeat === 1 && (prevprevSeat === 2 || prevprevSeat === 3) ||
        nextSeat === 1 && (nextnextSeat === 2 || nextnextSeat === 3)
      );
    }
    return false;
  }

  public onSeatClick = (seat: ISeat) => {
    this.setState({
      selectedSeat: seat,
      ticketSelectorExpanded: true,
    });
  }


  public onSeatEdit = (seat: ISeat) => {
    this.setState({
      selectedSeat: seat,
      ticketEditorExpanded: true,
    });
  }

  public onSeatRemove = (seat: ISeat) => () => {
    this.props.onRemoveSeat && this.props.onRemoveSeat(seat);
    this.onModalClose();
  }

  public onModalClose = () => {
    this.setState({
      ticketSelectorExpanded: false,
      ticketEditorExpanded: false,
    });
  }

  public onSelectSeat = (seat: ISeat, discount: ScheduleTypes.IDiscountInfo, label: string) => {
    this.props.onSelectSeat && this.props.onSelectSeat(
      seat, label, discount.name, discount.value, discount.id,
    );
  }

  public onDiscardDiscount = () => {
    this.onModalClose();
  }
  public zoomInClicked = () => {
    this.setState({ isZoomClicked: true });
  }
  public zoomOutClicked = () => {
    this.setState({ isZoomClicked: false });
  }


  render() {
    const { rowMarkers, seatArray } = this.state;
    const {
      prices,
      ticketsCount,
      hallMapLoading,
      onRemoveSeat,
      zones
    } = this.props;

    const isMobileOnly = false;

    return (
      <Preloader
        color="red"
        size={4}
        spinnerSize={6}
        className="m-center my-20"
        loading={!!hallMapLoading}>
        <div className="hall-map m-0 position-relative">
          <div className="hall-map__plus-minus d-flex align-items-center">
            <Image
              src={searchImg}
              alt="search plus"
              className="hall-map__plus-minus-img p-8"
              onClick={this.state.isZoomClicked ? this.zoomOutClicked : this.zoomInClicked}
            />
            {this.state.isZoomClicked ? (
              <Typography variant="subbodybold" className="ml-1">
                Уменьшить
              </Typography>
            ) : (
              <Typography variant="subbodybold" className="ml-1">
                Увеличить
              </Typography>
            )}
          </div>
          <div className="d-flex flex-column align-items-center w-100 mb-16">
            <div className="d-flex">
              <Typography variant="subbody" className="mr-24 ml-8">
                Экран
              </Typography>
            </div>
            <Image
              src={screenImg}
              alt="screen"
              className="hall-map__screen"
            />
          </div>
          <div className={`d-flex pos_relative justify-content-center gap-5 overflow-auto`}>
            <div className="hall-map__row-markers align-items-center d-flex flex-column mr-12">
              {rowMarkers.map((item: number, i: React.Key | null | undefined) => (
                <Typography
                  key={i}
                  variant={!isMobileOnly ? 'subbody' : this.state.isZoomClicked ? 'subbody' : 'caption'}
                  className={classNames([
                    this.state.isZoomClicked ?
                      'hall-map__row-markers__item lh-22' :
                      'hall-map__row-markers__item-little',
                  ])}
                >
                  {item === -1
                    ? ''
                    : item
                  }
                </Typography>
              ))}
            </div>
            <div className="d-flex flex-row hall-map__table-wrap">
              <table className={`hall-map__table d-flex ${this.props.isBasketOpen && "active"}`}>
                <tbody className={classNames(['m-auto', this.state.isZoomClicked && 'pr-40'])}>
                  {seatArray.map((row: ISeat[], rowIndex: React.Key | null | undefined) => (
                    <tr
                      key={rowIndex}
                      className="hall-map__table__row d-flex"
                    >
                      {row.map((col: ISeat, j) => (
                        React.createElement(HallMapSeat, {
                          prices,
                          ticketsCount,
                          onRemoveSeat,
                          key: j,
                          seat: col,
                          removable: true,
                          selectable: true,
                          onSelectSeat: this.onSelectSeat,
                          onSeatClick: this.onSeatClick,
                          onSeatEdit: this.onSeatEdit,
                          isZoomClicked: this.state.isZoomClicked,
                          isBasketOpen: this.props.isBasketOpen,
                          zones:zones,
                          resetHallMap:this.props.resetHallMap,
                          selectedDiscount: this.props.selectedDiscount,
                        })
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="hall-map__legends mt-2">
                  <div className="d-flex align-items-center justify-content-center flex-wrap" style={{width:500, margin:"0 auto", rowGap:8}}>
                    <div
                      // className="hall-map__legends hall-map__legends--little hall-map__legends--free"
                      className={classNames(['hall-map__legends hall-map__legends--free',
                        !this.state.isZoomClicked && 'hall-map__legends--little',
                      ])}
                    />
                    <Typography variant="subbody" className="mr-24 ml-8">
                      Свободно
                    </Typography>
                    <div
                      className={classNames(['hall-map__legends hall-map__legends--booked',
                        !this.state.isZoomClicked && 'hall-map__legends--little',
                      ])}
                    />
                    <Typography variant="subbody" className="mr-24 ml-8">
                      Занято
                    </Typography>
                    <div
                      className={classNames(['hall-map__legends hall-map__legends--selected',
                        !this.state.isZoomClicked && 'hall-map__legends--little',
                      ])}
                    />
                    <Typography variant="subbody" className="mr-24 ml-8">
                      Ваш выбор
                    </Typography>
                    <div
                      className={classNames(['hall-map__legends hall-map__legends--reserved',
                        !this.state.isZoomClicked && 'hall-map__legends--little',
                      ])}
                    />
                    <Typography variant="subbody" className="mr-24 ml-8">
                      Забронировано
                    </Typography>
                    {
                      zones?.map((zone:any) => {
                        return (
                          zone?.name.toLowerCase() !== "default" &&
                          <>
                          <div
                          className={classNames(['hall-map__legends',
                            !this.state.isZoomClicked && 'hall-map__legends--little',
                            ])}
                            style={{background:zone?.color}}
                          />
                          <Typography variant="subbody" className="mr-24 ml-8">
                            {zone?.name}
                          </Typography>
                          </>
                        )
                      })
                    }
                  </div>
                </div>
        </div>
      </Preloader>
    );
  }
}

export default HallMap;
