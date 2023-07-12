import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import jwt from 'jwt-decode'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { Select } from 'antd';
import { login } from "src/store/auth";
import { getDevices } from "src/store/ticket";
import { Modal } from 'antd';
import { getErrorMessage } from "src/utils/error";


interface IUser {
  login: string;
  password: string;
  device_id: string;
}


export default function Login() {
  const [user, setUser] = useState<IUser>({
    login:"",
    password:"",
    device_id:""
  });
  const [devices, setDevices] = useState<any>();
  const [side, setSide] = useState<string>();

  useEffect(() => {
    getDevices().then(res => {
      setDevices(res.data)
    })
  }, [])

  const navigate = useNavigate();

  const changeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      login: e.target.value
    });

  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      password:e.target.value
    });
  };
  
  const inputLogin = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    login(user).then((res: { status: number; data: any; }) => {
      if (res.status === 200){
        localStorage.setItem("authTokens", JSON.stringify(res.data));
        const resUser : any = jwt(res.data.access_token)
        localStorage.setItem("userID", resUser.user_id);
        localStorage.setItem("managerName", resUser.name)
        localStorage.setItem("pos", devices.filter((item:any) => item.id === user.device_id)[0]?.name)
        localStorage.setItem("side", 'client');
        navigate("/schedule")
        window.location.reload()
      }else{
        Modal.error({
          title: getErrorMessage(res.data.code)
        })
      }
    })
  }

  const { Option } = Select;

  const handleChange = (value: string) => {
    setUser({...user, device_id: value})
  };

  return (
    <div className="app flex-row align-items-center" style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}}>
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form onSubmit={(e) => inputLogin(e)}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        style={{textAlign:"left"}}
                        onChange={(e) => changeLogin(e)}
                        value={user?.login}
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        style={{textAlign:"left"}}
                        onChange={(e) => changePassword(e)}
                        value={user?.password}
                      />
                    </InputGroup>
                    <Select placeholder="Выберите девайс" style={{ width: "100%" }} onChange={handleChange} className="mb-4 mt-4">
                      {
                        devices?.map((device : any) => (
                          <Option value={device?.id}>{device?.name}</Option>
                        ))
                      }
                    </Select>
                    {/* <Select placeholder="Выберите сторону" style={{ width: "100%" }} value={side} onChange={(e) => setSide(e)} className="mb-4 mt-4">
                        <Option value="cashier">Кассир</Option> 
                        <Option value="client">Клиент</Option>
                    </Select> */}
                    <Row>
                      <Col xs="6">
                        <Button
                          color="primary"
                          className="px-4"
                          onClick={(e) => inputLogin(e)}
                          type="submit"
                          disabled={!(user?.login.length > 0 && user?.password.length > 0 && user?.device_id.length > 0)}
                        >
                          Login
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
              <Card
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: "44%" }}
              >
                <CardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <Link to="/register">
                      <Button
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
