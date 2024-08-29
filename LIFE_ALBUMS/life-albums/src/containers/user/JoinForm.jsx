import React from 'react';
import Input from '../../components/user/Input';
import Button from '../../components/user/Button';


// JoinForm 컴포넌트는 여러 입력 필드와 버튼을 포함하는 회원가입 폼을 렌더링합니다.
const JoinForm = () => {
  return (
    <form className="w-full max-w-md mx-auto mt-8">
      {/* ID 입력 필드와 중복 확인 버튼 */}
      <div className="mb-4">
        <Input label="ID" type="text" placeholder="ID" checkLabel="중복 확인" />
      </div>
      {/* 비밀번호 입력 필드 */}
      <div className="mb-4">
        <Input label="PASSWORD" type="password" placeholder="PASSWORD" />
      </div>
      {/* 비밀번호 확인 입력 필드 */}
      <div className="mb-4">
        <Input label="PASSWORD CHECK" type="password" placeholder="PASSWORD CHECK" />
      </div>
      {/* 이름 입력 필드 */}
      <div className="mb-4">
        <Input label="NAME" type="text" placeholder="NAME" />
      </div>
      {/* 이메일 입력 필드와 중복 확인 버튼 */}
      <div className="mb-4">
        <Input label="EMAIL" type="email" placeholder="E-MAIL" checkLabel="중복 확인" />
      </div>
      {/* 전화번호 입력 필드 */}
      <div className="mb-4">
        <Input label="PHONE NUMBER" type="text" placeholder="PHONE NUMBER" />
      </div>
      {/* 회원가입 버튼 */}
      <div className="mt-8 mb-4">
        <Button text="회원가입" />
      </div>
    </form>
  );
};

export default JoinForm;