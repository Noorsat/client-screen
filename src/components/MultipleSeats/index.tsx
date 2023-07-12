import {FC, useState} from 'react';
import { ScheduleResponse } from 'src/store/schedule/types';
import './index.scss'
import { IMultipleSeats } from './types';

const MultipleSeats = ({prices, selectedDiscount, selectDiscountHandler} : IMultipleSeats) => {
    return (
        <div className='d-flex justify-content-center gap-3 mt-2 mb-2' style={{cursor:"pointer"}}>
            {
                Array.from(new Set(prices.map((a : ScheduleResponse.IGetBySeanceDiscount) => a.name)))
                .map(name => {
                  return prices.find((a:ScheduleResponse.IGetBySeanceDiscount) => a.name === name)
                })?.map((price) => (
                    <div className={`price__item ${prices.filter((item : ScheduleResponse.IGetBySeanceDiscount) => item?.id === selectedDiscount)[0]?.name === price?.name && "price__item-active"}`} onClick={() => selectDiscountHandler(price!.id)}>
                        <div className='text-center'>
                            {price?.name}
                        </div>
                        {
                            [prices?.filter((p : ScheduleResponse.IGetBySeanceDiscount) => p?.name === price?.name)[0]].map((item : ScheduleResponse.IGetBySeanceDiscount) => (
                                <div className='text-center'>
                                    {item?.value}
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default MultipleSeats;