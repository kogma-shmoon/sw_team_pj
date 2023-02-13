import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom"; // 로그인정보 전달

function HomePage() {
  
  const {state} = useLocation(); // 로그인정보 저장

  // 로그아웃
  const onLogoutHandler = () => {
    let token = localStorage.getItem('token')
    localStorage.clear()
  }
  
  return (
    <div>
      <h1>HomePage.jsx</h1>
      <h1>{state}님 환영합니다.</h1>
      <Link to="/">
        <h1>페이지 이름</h1>
      </Link>
      <Link to="/members/test/write">
        <h1>일기 쓰러 가기</h1>
      </Link>
      <Link to="/diaries/id/date">
        <h1>10일</h1>
      </Link>
      <Link to="/">
        <button type="button" onClick={onLogoutHandler}>로그아웃</button>
      </Link>
    </div>
  );
}

export default HomePage;
