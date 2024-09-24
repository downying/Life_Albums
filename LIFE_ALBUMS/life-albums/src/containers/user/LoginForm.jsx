import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie';  
import { LoginContext } from '../../components/LoginProvider'; 
import Input from '../../components/user/Input';
import Checkbox from '../../components/user/Checkbox';
import Button from '../../components/user/Button';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [rememberId, setRememberId] = useState(false); // 체크박스 상태
  const { login, error, savedUsername } = useContext(LoginContext); 
  const navigate = useNavigate();

  // 페이지 로드 시 로컬 스토리지에 저장된 아이디 자동 입력
  useEffect(() => {
    if (savedUsername) {
      setId(savedUsername);
      setRememberId(true); // 로컬 스토리지에 저장된 아이디가 있으면 체크박스 활성화
    }
  }, [savedUsername]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    console.log("rememberId 상태:", rememberId);  // rememberId 상태 로그 확인
    
    login(id, pw, rememberId, navigate).then((isSuccess) => {
      if (isSuccess) {
        if (rememberId) {
          Cookies.set('rememberedId', id, { expires: 7 });  // 쿠키에 아이디 저장
          console.log('쿠키 저장됨:', Cookies.get('rememberedId')); // 디버깅 로그
          localStorage.setItem('savedUsername', id);         // 로컬 스토리지에도 저장
        } else {
          Cookies.remove('rememberedId');   // 체크박스가 해제된 경우, 쿠키에서 삭제
          console.log('쿠키 삭제됨');
        }
      }
    });
  };

  const handleCheckboxChange = (e) => {
    setRememberId(e.target.checked);  // 체크박스 상태 변경
    console.log("체크박스 상태 변경됨:", e.target.checked);  // 디버깅 로그 추가
  };

  const handleLogout = () => {
    Cookies.remove('authToken');  // 인증 토큰을 삭제
    navigate('/');
  };

  return (
    <div>
      <div className="w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Input 
              type="text" 
              placeholder="ID" 
              value={id} 
              onChange={(e) => setId(e.target.value)} 
            />
          </div>
          <div className="mb-4">
            <Input 
              type="password" 
              placeholder="PASSWORD" 
              value={pw} 
              onChange={(e) => setPw(e.target.value)} 
            />
          </div>
          <div className="mb-4 flex justify-center items-center"> 
            <Checkbox 
              label="아이디 저장" 
              className="text-sm" 
              checked={rememberId}  // 체크박스 상태 전달
              onChange={handleCheckboxChange}  // 체크박스 상태 변경 처리
            /> 
          </div>
          {error && (
            <div className="text-red-500 text-xs mb-4 text-center">
              아이디 또는 비밀번호가 잘못 되었습니다.
            </div>
          )}
          <div className="mb-4">
            <Button text="로그인" className="w-full"/>
          </div>
        </form>
      <div className="text-center text-[0.8125rem] text-gray-600"> 
        <Link to="/findId" className="mr-1">아이디 찾기</Link> | 
        <Link to="/findPassword" className="ml-1 mr-1">비밀번호 찾기</Link> | 
        <Link to="/join" className="ml-1">회원가입</Link>
      </div>
    </div>

    </div>
    
  );
};

export default LoginForm;
