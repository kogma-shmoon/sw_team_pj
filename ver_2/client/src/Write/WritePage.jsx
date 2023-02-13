import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

const Header = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 10%;
  position: fixed;
`;

const Layout = styled.div`
  margin-top: 7%;
  width: 100vw;
  height: 100vh;
  display: "flex";
  flexdirection: "column";
  alignitems: "center";
  position: fixed;
  padding-left: 10px;
  margin-right: 100px;
`;

const BackButton = styled.button`
  color: #aeaeae;
  background: #f5f5f5;
  font: AbeeZee;
  border: none;
  border-radius: 4px;
  margin: 20px;
  padding: 10px 15px;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 1px gray;
  }
`;

const SaveButton = styled.button`
  color: black;
  background: #e5e0ff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  margin: 20px 20px 20px 1350px;
  padding: 10px 15px;

  &:hover {
    cursor: pointer;
  }
  &:focus {
    box-shadow: 0 0 0 1px gray;
  }
`;
//버튼과 구분선이 헤더에 고정되게 해야 함

const DateInput = styled(DatePicker)`
  margin-bottom: 10px;
  border: none;
  font-size: 15px;
  color: #aeaeae;

  &:focus {
    outline: 0;
  }
`;

const Title = styled.input`
  font-size: 35px;
  font-weight: bold;
  border: none;
  margin-bottom: 15px;

  &:focus {
    outline: 0;
  }
`;

const Content = styled.textarea`
  background: #f5f5f5;
  padding: 40px;
  margin-top: 20px;
  height: 50vh;
  width: 100%;
  max-width: 100%;
  font-size: 16px;
  font-family: AbeeZee, sans-serif;
  border: none;
  border-radius: 4px;
  resize: none;

  &:focus {
    outline: 0;
  }
`;

//임시저장 버튼 보류

function WritePage() {
  const [startDate, setStartDate] = useState(new window.Date());
  const [title, setTitle] = useState("제목");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const onTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const onContentHandler = (event) => {
    setContent(event.target.value);
  };

  const dateToString = () => {
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    const date = startDate.getDate();
    return `${year}-${month >= 10 ? month : "0" + month}-${
      date >= 10 ? date : "0" + date
    }`;
  };

  const onSaveButtonHandler = () => {
    //임시 post 함수
    axios
      .post("/members/test/write", {
        date: dateToString(startDate),
        title: title,
        content: content,
        token: token,
      })
      .then(function (response) {
        console.log(response);
        alert("일기 제출 정상 작동");
        navigate("/members/home");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Header>
        <Link to="/members/home">
          <BackButton>이전</BackButton>
        </Link>
        <SaveButton onClick={onSaveButtonHandler}>저장</SaveButton>
        <hr style={{ marginTop: "0px" }} />
      </Header>

      <Layout>
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "90%",
            margin: "0px 50px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <DateInput
              showIcon
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd &#128198;"
              locale={ko}
            />
            <Title defaultValue="제목" onChange={onTitleHandler}></Title>
          </div>
          <hr />
          {/* 데이터 확인용 버튼 */}
          {/* <button onClick={()=>{ console.log(dateToString(startDate)); console.log(title); console.log(content);}} />  */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Content onChange={onContentHandler}>{content}</Content>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default WritePage;
