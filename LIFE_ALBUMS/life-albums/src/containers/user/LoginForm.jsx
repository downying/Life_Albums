import React, { useState, useEffect } from 'react';
import Input from '../../components/user/Input';
import Checkbox from '../../components/user/Checkbox';
import Button from '../../components/user/Button';
import { Link } from 'react-router-dom';
import api from '../../apis/axios';  
import Cookies from 'js-cookie';  // 쿠키 관리 라이브러리

const LoginForm = () => {
  const [id, setId] = useState('');  // ID 상태
  const [pw, setPw] = useState('');  // 비밀번호 상태
  const [rememberId, setRememberId] = useState(false);  // 아이디 저장 체크 여부
  const [error, setError] = useState(null);  // 에러 상태

  // 컴포넌트가 마운트될 때 쿠키에서 ID를 가져옴
  useEffect(() => {
    const savedId = Cookies.get('remember-id');  // 쿠키에서 'remember-id'를 가져옴
    if (savedId) {
      setId(savedId);  // ID를 상태에 설정
      setRememberId(true);  // 아이디 저장 체크박스 상태 설정
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/users/login', { id, pw });

      if (response.data) {
        // 로그인 성공 처리
        alert('로그인 성공');
        // localStorage.setItem('token', response.data.token); // JWT 토큰 사용하지 않음

        if (rememberId) {
          Cookies.set('remember-id', id, { expires: 7 });  // ID를 쿠키에 저장 (7일 동안 유효)
        } else {
          Cookies.remove('remember-id');  // 체크 해제 시 쿠키에서 ID 제거
        }

        window.location.href = '/dashboard'; // 로그인 후 이동할 페이지
      } else {
        setError('로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
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
            checked={rememberId}
            onChange={(e) => setRememberId(e.target.checked)}
          /> 
        </div>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        <div className="mb-4">
          <Button text="로그인" />
        </div>
      </form>
      <div className="text-center text-[0.8125rem] text-gray-600"> 
        <Link to="/" className="mr-1">아이디 찾기</Link> | 
        <Link to="/" className="ml-1 mr-1">비밀번호 찾기</Link> | 
        <Link to="/join" className="ml-1">회원가입</Link>
      </div>
    </div>
  );
};

export default LoginForm;
