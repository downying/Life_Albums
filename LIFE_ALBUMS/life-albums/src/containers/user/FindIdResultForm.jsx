import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/user/Button';
import TextDisplay from '../../components/user/TextDisplay'; // 텍스트를 보여주는 컴포넌트

const FindIdResultForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 전달받은 상태가 없을 경우 초기 화면으로 리다이렉트
  if (!location.state || !location.state.id) {
    navigate('/');
    return null; // 상태가 없을 때는 아무것도 렌더링하지 않음
  }

  const { id } = location.state; // 전달받은 ID

  return (
    <div className="w-full max-w-xs mx-auto text-center">
      <TextDisplay text={`회원님의 아이디는 ${id} 입니다.`} /> {/* 결과 출력 */}
      <Button text="확인" onClick={() => navigate('/')} /> {/* 확인 버튼 */}
    </div>
  );
};

export default FindIdResultForm;
