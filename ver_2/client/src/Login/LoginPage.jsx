import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Background = styled.div`
  height: auto;
  width: 100%;
  background: url(/image/main_bg.jpg) no-repeat center;
  background-size: cover;
  background: #c0392b; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #ffdede,
    #a2a1ff
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #ffdede,
    #a2a1ff
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const Label = styled.label`
  color: #7286d3;
  font-weight: bold;
`;

const SignUpLink = styled.a`
  color: #5475ed;
  font-weight: bold;
  text-decoration: none;
  font-size: large;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const LoginFormRectangle = styled.div`
  width: 397px;
  height: 341px;
  background-color: #f5f5f5;
  border-radius: 0.8em;
  box-shadow: 0px 7px 4px #00000040;
  padding: 50px;
`;

const Input = styled.input`
  color: black;
  background-color: transparent;
  padding: 8px 100px 3px 0px;
  margin: 10px 0px;
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-bottom-width: 0.8px;
  border-color: black;
  padding-left: 14px;
  text-align: left;
`;

const LoginButton = styled.button`
  color: white;
  font-weight: bold;
  padding: 5px 1px;
  background: #a2a1ff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 7px;

  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 1px gray;
  }
`;

function LoginPage(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onIdHandler = (event) => {
    setId(event.currentTarget.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onLoginHandler = async (event) => {
    event.preventDefault();

    console.log("login 버튼 클릭!");
    if (id === "" || password === "") {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const result = await axios
      .post("/members/login", {
        //서버로 id, password 전달
        id: id,
        password: password,
      })
      .then((res) => {
        console.log(res);
        console.log("res.data.userId :: ", res.data.userId);
        console.log("res.data.msg :: ", res.data.msg);

        console.log("res.data.token", res.data.token);

        if (res.data.userId === undefined) {
          // id 일치하지 않는 경우 userId = undefined, msg = '입력하신 id 가 일치하지 않습니다.'
          console.log("======================", res.data.msg);
          alert("입력하신 id가 일치하지 않습니다.");
        } else if (res.data.userId === null) {
          // id는 있지만, pw 는 다른 경우 userId = null , msg = undefined
          console.log(
            "======================",
            "입력하신 비밀번호가 일치하지 않습니다."
          );
          alert("입력하신 비밀번호가 일치하지 않습니다.");
        } else if (res.data.userId === id) {
          // id, pw 모두 일치 userId = userId1, msg = undefined
          console.log("======================", "로그인 성공");
          navigate("/members/home", {state: id}); // 회원 ID 전달
          //localStorage.setItem("token", res.data.jwt); //(주석 제거 필요!!) 데이터 받아왔을 때 특정 이름으로 저장하는 거. 다른 곳에서 토큰 불러올 수 있게 처리하는 작업
          localStorage.setItem("token", res.data.token);

          //sessionStorage.setItem('user_id', id) //참고로 적어둠
        }
      })
      .catch((error) => {
        alert(
          "아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요."
        );
        console.log("로그인 에러 발생", error.response);
      });
    console.log("Submit Button Click"); //확인용
  };
  //로그인 하고 로그인페이지 돌아오면 다시 홈으로 가도록 하는 기능 구현. (): 받아올 변수, {}: 실행할 코드, []: []에 들어있는 조건이 해당될 때만 렌더링 이외의 다른 정보를 다시 reload 하겠다!
  useEffect(() => {
    if (localStorage.getItem("token")) {
      //위의 setItem으로 이미 localStorage에 저장해두었음
      //로그인 이미 한 경우
      navigate("/members/home"); //페이지 이동 => home으로 바꿔야댐!!!!
    }
  }, []);

  return (
    <div>
      <Background>
        <br />
        <br />
        <Link to="/" style={{ textDecoration: "none" }}>
          <center>
            <h1 style={{ color: "#424448" }}>웹페이지 이름</h1>{" "}
          </center>
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "90vh",
          }}
        >
          <div>
            <LoginFormRectangle>
              <form style={{ display: "flex", flexDirection: "column" }}>
                <center>
                  <h1 style={{ color: "#616161" }}>User Login</h1>
                </center>
                <Label>User Id</Label>
                <Input type="text" onChange={onIdHandler} value={id} />
                <br />
                <br />
                <Label>Passsword</Label>
                <Input
                  type="password"
                  onChange={onPasswordHandler}
                  value={password}
                />
                <br />
                <br />
                <LoginButton onClick={onLoginHandler}>Log in</LoginButton>{" "}
                <hr />
              </form>
            </LoginFormRectangle>
            <Link to="/members/register">
              <br />
              <br />
              <center>
                <SignUpLink>Sign Up</SignUpLink>
              </center>
            </Link>
          </div>
        </div>
      </Background>
    </div>
  );
}
export default LoginPage;
