import {
  Routes,
  Route,
  useSearchParams,
} from 'react-router-dom';
import Login from 'src/pages/login';
import NewSchedule from 'src/pages/newSchedule';
import Register from 'src/pages/register';
import { SchedulePage } from "src/pages/schedule";
import { Seance } from "../pages/seance/[id]";
import jwt from 'jwt-decode'
import { useEffect, useState } from 'react'; 
import { login } from "src/store/auth";
import { getDevices } from 'src/store/ticket';

export function MainRouting() {
    const [searchParams] : any = useSearchParams()

   useEffect(() => {
    
      const log = searchParams.get('login')
      const password = searchParams.get('password')
      const device_id = searchParams.get('deviceId') 

      const user = {
        login: log,
        password, 
        device_id
      }

      login(user).then((res) => {
        if (res.status === 200){
          let devices : any = [];
          getDevices().then(res => {
            localStorage.setItem("pos", res?.data?.filter((item:any) => item.id === device_id)[0]?.name)
          })
          localStorage.setItem("authTokens", JSON.stringify(res.data));
          const resUser : any = jwt(res.data.access_token)
          localStorage.setItem("userID", resUser.user_id);
          localStorage.setItem("managerName", resUser.name)
          localStorage.setItem("side", 'client');
        }
      })
   }, [])

  return (
    <Routes>
      <Route path="/schedule" element={<SchedulePage /> } />
      <Route path="/seance/:id" element={<Seance  /> } />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<SchedulePage /> } />
      <Route path="/new-schedule" element={ <NewSchedule /> } />
    </Routes>
  );
}
