import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/user/Button';
import TextDisplay from '../../components/user/TextDisplay'; // 텍스트를 보여주는 컴포넌트

const FindIdResultForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 전달받은 id가 없을 경우 리다이렉트
    if (!location.state || !location.state.id) {
      console.log('아이디를 전달받지 못했습니다.');
      alert('아이디 정보를 전달받지 못했습니다.');
      navigate('/'); // 상태가 없을 때 메인 페이지로 이동
    } 
  }, [location, navigate]);

  // id가 없을 때 리다이렉션 처리 중이므로 렌더링을 하지 않음
  if (!location.state || !location.state.id) {
    return null;
  }

  const { id } = location.state; // 전달받은 ID

  return (
    <div className="flex flex-col justify-center items-center min-h-[88vh] bg-gray-100">
      <div className="w-full max-w-xl mx-auto text-center mt-20">
        {/* TextDisplay로 ID 출력 */}
        <TextDisplay id={id} />
        {/* 확인 버튼 */}
        <Button text="확인" onClick={() => navigate('/')} /> {/* 클릭 시 메인 페이지로 이동 */}
      </div>
    </div>
  );
};

export default FindIdResultForm;
