import React, {useEffect, useState} from "react";
import {Outlet, useLocation} from 'react-router-dom'
import {Helmet} from "react-helmet";

const SubLayout = () => {
  const [currentUrl, setcurrentUrl] = useState("");
  // 현재의 url을 추적
  const location = useLocation()
  // url이 변경될 때마다 저장해줌
  useEffect(() => {
    setcurrentUrl(location.pathname)
  },[location.pathname])
  return (
    <>
      {/*Helmet 라이브러리를 사용하여 상단바 동적 컨트롤
      인덱스에서만 오렌지 색상 부여
      */}
      {
        currentUrl=="/signup" ?
          <Helmet>
            <meta name="theme-color" id="theme-color" content="#FFBE5C"/>
          </Helmet>
        :
          <Helmet>
            <meta name="theme-color" id="theme-color" content="#ffffff"/>
          </Helmet>
      }
      <div id="subContainer">
        <Outlet />
      </div>
    </>
  )
}

export default SubLayout