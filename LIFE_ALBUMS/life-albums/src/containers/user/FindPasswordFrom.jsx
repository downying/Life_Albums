import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/user/Input';
import Button from '../../components/user/Button';
import { sendAuthCode } from '../../apis/user/auth'; // API 추가

// 비밀번호 찾기 폼
const FindPasswordForm = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [mail, setMail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  // 인증번호 발송 처리 함수
  const handleVerification = async () => {
    if (!name || !id || !mail) {
      alert('이름, 아이디, 이메일을 입력해주세요.');
      return;
    }
  
    try {
      console.log('전송할 데이터:', { name, id, mail }); // 여기서 name, id, mail 확인
      console.log('인증번호 발송 요청 중...');
      const response = await sendAuthCode(name, id, mail);
      if (response.status === 200) {
        console.log('인증번호 발송 성공:', response.data.authCode);
        setVerificationCode(response.data.authCode); // 인증번호 저장
        setIsCodeSent(true);
      }
    } catch (error) {
      console.error('인증번호 발송 실패:', error);
      alert('인증번호 발송에 실패했습니다.');
    }
  };
  

  // 폼 제출 처리 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputVerificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    if (inputVerificationCode !== verificationCode) {
      alert('인증번호가 일치하지 않습니다.');
      console.log('입력한 인증번호가 다릅니다:', inputVerificationCode, verificationCode);
      return;
    }

    console.log('인증번호가 일치합니다. 비밀번호 재설정 페이지로 이동합니다.');
    // 인증번호가 일치하면 비밀번호 재설정 페이지로 이동
    navigate('/resetPassword', { state: { id } }); // ID를 상태로 전달
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <h1 className="text-center text-4xl font-bold text-black-900 mb-8 mt-8">FIND PASSWORD</h1>
      <form onSubmit={handleSubmit}>
        {/* 이름 입력 필드 */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 아이디 입력 필드 */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        {/* 이메일 입력 필드 */}
        <div className="mb-4">
          <Input
            type="email"
            placeholder="EMAIL"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            checkLabel="인증번호"
            onCheckClick={handleVerification} // 인증번호 발송 버튼
          />
        </div>

        {/* 인증번호 입력 필드 (인증번호 발송 후 표시) */}
        {isCodeSent && (
          <div className="mb-4">
            <Input
              type="text"
              placeholder="인증번호를 입력하세요"
              value={inputVerificationCode}
              onChange={(e) => setInputVerificationCode(e.target.value)}
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
