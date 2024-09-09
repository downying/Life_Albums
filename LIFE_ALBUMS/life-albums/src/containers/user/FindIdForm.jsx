import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { findId } from '../../apis/user/auth'; 
import Input from '../../components/user/Input';
import Button from '../../components/user/Button';

const FindIdForm = () => {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate(); // useNavigate 사용

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 막기

    // 필드가 비어있을 경우 알림 메시지 표시
    if (!name || !mail || !phone) {
      alert('모든 정보를 입력해주세요.');
      return; // 제출 중단
    }

    try {
      // findId 함수로 API 호출 (GET 요청)
      const response = await findId(name, mail, phone);
      
      // 서버로부터 응답이 성공적으로 돌아온 경우
      if (response.status === 200) {
        const { id } = response.data;
        console.log('찾은 아이디:', id); // ID 확인용 콘솔 출력
        // ID 확인 페이지로 이동하며 찾은 아이디를 전달
        navigate('/findIdResult', { state: { id } });
      } else {
        // 서버가 200이 아닌 상태로 응답한 경우
        alert('입력하신 정보로 아이디를 찾을 수 없습니다.');
      }
    } catch (error) {
      // 에러 처리: 서버 요청 중 문제가 발생했을 때
      console.error('ID 찾기 오류:', error);
      alert('입력하신 정보로 아이디를 찾을 수 없습니다.');
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">FIND ID</h2>
      <form onSubmit={handleSubmit}>
        {/* 이름 입력 필드 */}
        <div className="mb-4">
          <Input
            type="text"
            label="NAME"
            placeholder="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)} // 입력값 변경 시 상태 업데이트
          />
        </div>

        {/* 이메일 입력 필드 */}
        <div className="mb-4">
          <Input
            type="email"
            label="EMAIL"
            placeholder="EMAIL"
            value={mail}
            onChange={(e) => setMail(e.target.value)} // 입력값 변경 시 상태 업데이트
          />
        </div>

        {/* 전화번호 입력 필드 */}
        <div className="mb-6">
          <Input
            type="text"
            label="PHONE NUMBER"
            placeholder="PHONE NUMBER"
            value={phone}
            onChange={(e) => setPhone(e.target.value)} // 입력값 변경 시 상태 업데이트
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex items-center justify-center">
          <Button text="아이디 찾기" /> {/* Button 컴포넌트 사용 */}
        </div>
      </form>
    </div>
  );
};

export default FindIdForm;
