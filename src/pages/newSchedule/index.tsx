import { FC } from "react";
import './index.scss';
import NewScheduleDate from "src/components/NewScheduleDate";
import NewScheduleHeader from "src/components/NewScheduleHeader";
import NewScheduleMovies from "src/components/NewScheduleMovies";

const NewSchedule : FC = () => {
    return (
        <div>
            <NewScheduleHeader />
            <NewScheduleDate />
            <div className="wrapper">
                <NewScheduleMovies />
                <NewScheduleMovies />
                <NewScheduleMovies />
                <NewScheduleMovies />
                <NewScheduleMovies />
                <NewScheduleMovies />
                <NewScheduleMovies />
            </div>
        </div>
    )
}

export default NewSchedule;