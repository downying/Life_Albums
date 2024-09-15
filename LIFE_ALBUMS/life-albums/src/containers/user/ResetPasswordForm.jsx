import React, { useState } from 'react';
import Input from '../../components/user/Input';
import Button from '../../components/user/Button';


// 비밀번호 재설정 폼
const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === passwordCheck) {
      // 비밀번호 재설정 로직 처리
      console.log('비밀번호가 성공적으로 변경되었습니다.');
    } else {
      console.log('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
      <h1 className="text-center text-4xl font-bold text-black-900 mb-8 mt-8">RESET PASSWORD</h1>
      <p className="text-center text-lg text-black-900 mb-8 mt-8">비밀번호를 재설정 해주세요</p>
      <Input 
        // label="PASSWORD" 
        placeholder="PASSWORD"
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <Input 
        // label="PASSWORD CHECK" 
        placeholder="PASSWORD CHECK"
        type="password" 
        value={passwordCheck} 
        onChange={(e) => setPasswordCheck(e.target.value)} 
      />
      <div className='mt-8'>
        <Button text="확인" />
      </div>
      
    </form>
  );
};

export default ResetPasswordForm;
