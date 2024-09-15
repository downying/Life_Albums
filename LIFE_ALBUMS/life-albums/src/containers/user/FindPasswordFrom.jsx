import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import Input from '../../components/user/Input';
import Button from '../../components/user/Button';

// 비밀번호 찾기 폼
const FindPasswordForm = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부 확인
  const [inputVerificationCode, setInputVerificationCode] = useState(''); // 입력된 인증번호
  const navigate = useNavigate(); // useNavigate 사용

  // 하드코딩된 인증번호
  const hardcodedCode = '123456';

  // 인증번호 발송 처리 함수
  const handleVerification = () => {
    // 필드가 비어있는지 체크
    if (!name || !id || !email) {
      alert('이름, 아이디, 이메일을 입력해주세요.');
      return;
    }

    // 인증번호 발송 로직 (여기서는 하드코딩된 인증번호)
    console.log('인증번호가 발송되었습니다.');
    setVerificationCode(hardcodedCode); // 하드코딩된 인증번호를 설정
    setIsCodeSent(true); // 인증번호 발송 상태 변경
  };

  // 폼 제출 처리 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    // 필드가 비어있을 경우 알림 메시지 표시
    if (!name || !id || !email || !inputVerificationCode) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    // 인증번호 일치 여부 확인
    if (inputVerificationCode !== verificationCode) {
      alert('인증번호가 일치하지 않습니다.');
      return;
    }

    // 인증번호가 일치하면 비밀번호 재설정 페이지로 이동
    navigate('/resetPassword'); // 비밀번호 재설정 페이지로 이동
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <h1 className="text-center text-4xl font-bold text-black-900 mb-8 mt-8">FIND PASSWORD</h1>
      <form onSubmit={handleSubmit}>
        {/* 이름 입력 필드 */}
        <div className="mb-4">
          <Input
            type="text"
            // label="NAME"
            placeholder="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)} // 입력값 변경 시 상태 업데이트
          />
        </div>

        {/* 아이디 입력 필드 */}
        <div className="mb-4">
          <Input
            type="text"
            // label="ID"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)} 
          />
        </div>

        {/* 이메일 입력 필드 */}
        <div className="mb-4">
          <Input
            type="email"
            // label="EMAIL"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            checkLabel="인증번호" // 버튼 텍스트
            onCheckClick={handleVerification} // 버튼 클릭 시 실행될 함수
          />
        </div>

        {/* 인증번호 입력 필드 (인증번호가 발송된 경우만 표시) */}
        {isCodeSent && (
          <div className="mb-4">
            <Input
              type="text"
              // label="인증번호"
              placeholder="인증번호를 입력하세요"
              value={inputVerificationCode}
              onChange={(e) => setInputVerificationCode(e.target.value)} // 입력된 인증번호 상태 업데이트
            />
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="flex items-center justify-center mt-8">
          <Button text="비밀번호 찾기" />
        </div>
      </form>
    </div>
  );
};

export default FindPasswordForm;
