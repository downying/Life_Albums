import React from 'react';
import Input from '../../components/user/Input';
import Checkbox from '../../components/user/Checkbox';
import Button from '../../components/user/Button';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">LOGIN</h2>
      <form>
        <div className="mb-4">
          <Input type="text" placeholder="ID" />
        </div>
        <div className="mb-4">
          <Input type="password" placeholder="PASSWORD" />
        </div>
        <div className="mb-4 flex justify-center items-center"> 
          <Checkbox label="아이디 저장" className="text-sm" /> 
        </div>
        <div className="mb-4">
          <Button text="로그인" />
        </div>
      </form>
      <div className="text-center text-[0.8125rem] text-gray-600"> {/* Custom text size */}
        <Link to="/" className="mr-1">아이디 찾기</Link> | 
        <Link to="/" className="ml-1 mr-1">비밀번호 찾기</Link> | 
        <Link to="/" className="ml-1">회원가입</Link>
      </div>
    </div>
  );
};

export default LoginForm;
