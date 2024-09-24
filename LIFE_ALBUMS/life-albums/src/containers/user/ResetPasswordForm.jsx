import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/user/Input';
import Button from '../../components/user/Button';
import { resetPw } from '../../apis/user/auth'; // 비밀번호 재설정 API 추가

// 비밀번호 재설정 폼
const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // FindPasswordForm에서 전달된 ID를 받음

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      console.log('비밀번호와 비밀번호 확인이 일치하지 않습니다:', password, passwordCheck);
      return;
    }

    try {
      console.log('비밀번호 재설정 요청 중...');
      // 비밀번호 재설정 API 호출
      const response = await resetPw({ id: location.state.id, pw: password, pwCheck: passwordCheck });
      if (response.status === 200) {
        console.log('비밀번호 재설정 성공');
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/login'); // 비밀번호 변경 후 로그인 페이지로 이동
      }
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
      <h1 className="text-center text-4xl font-bold text-black-900 mb-8 mt-8">RESET PASSWORD</h1>
      <p className="text-center text-lg text-black-900 mb-8">비밀번호를 재설정 해주세요.</p>

      {/* 비밀번호 입력 필드 */}
      <Input
        placeholder="PASSWORD"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* 비밀번호 확인 입력 필드 */}
      <Input
        placeholder="PASSWORD CHECK"
        type="password"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
      />

      {/* 확인 버튼 */}
      <div className="mt-8">
        <Button text="확인" />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
