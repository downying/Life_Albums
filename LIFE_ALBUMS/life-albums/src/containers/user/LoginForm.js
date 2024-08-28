import React from 'react';
import Input from '../../components/user/Input';
import Checkbox from '../../components/user/Checkbox';
import Button from '../../components/user/Button';

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
        <div className="mb-4">
          <Checkbox label="아이디 저장" />
        </div>
        <div className="mb-4">
          <Button text="로그인" />
        </div>
      </form>
      <div className="text-center text-sm text-gray-600">
        <a href="/" className="mr-2">아이디 찾기</a> | 
        <a href="/" className="ml-2 mr-2">비밀번호 찾기</a> | 
        <a href="/" className="ml-2">회원가입</a>
      </div>
    </div>
  );
};

export default LoginForm;
