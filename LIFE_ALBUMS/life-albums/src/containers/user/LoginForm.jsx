import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { LoginContext } from '../../components/LoginProvider'; 
import Input from '../../components/user/Input';
import Checkbox from '../../components/user/Checkbox';
import Button from '../../components/user/Button';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const { login, error } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(id, pw, rememberId, navigate);
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
        <Link to="/findId" className="mr-1">아이디 찾기</Link> | 
        <Link to="/" className="ml-1 mr-1">비밀번호 찾기</Link> | 
        <Link to="/join" className="ml-1">회원가입</Link>
      </div>
    </div>
  );
};

export default LoginForm;
