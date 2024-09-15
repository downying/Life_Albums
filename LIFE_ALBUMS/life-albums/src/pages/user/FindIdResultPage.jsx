import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/user/Button';
import TextDisplay from '../../components/user/TextDisplay'; // 텍스트를 보여주는 컴포넌트

const FindIdResultForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state || !location.state.id) {
      console.log('아이디를 전달받지 못했습니다.');
      alert('아이디 정보를 전달받지 못했습니다.');
      navigate('/');
    } else {
      console.log('전달받은 아이디:', location.state.id); // ID 확인용 콘솔 출력
    }
  }, [location, navigate]);

  if (!location.state || !location.state.id) {
    return null; // 상태가 없을 때는 아무것도 렌더링하지 않음
  }

  const { id } = location.state; // 전달받은 ID

  return (
    <div className="flex flex-col justify-center items-center min-h-[88vh] bg-gray-100">
      {/* 메인 콘텐츠를 중앙보다 조금 더 위로 올립니다 */}
      <div className="w-full max-w-lg mx-auto text-center">
        {/* ID 출력: TextDisplay 컴포넌트로 출력 */}
        <TextDisplay id={id} />
        <div className="w-full max-w-xs mx-auto text-center">
          {/* 확인 버튼 */}
          <Button text="확인" onClick={() => navigate('/')} />
        </div>
        
        
      </div>
    </div>
  );
};

export default FindIdResultForm;
