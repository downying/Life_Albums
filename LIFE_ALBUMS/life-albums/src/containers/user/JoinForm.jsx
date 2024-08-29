import React from 'react';
import Input from '../../components/user/Input';
import Button from '../../components/user/Button';

const JoinForm = () => {
  return (
    <form className="w-full max-w-sm mx-auto mt-4 p-4">
      {/* ID 입력 필드와 중복 확인 버튼 */}
      <div className="mb-2">
        <Input label="ID" type="text" placeholder="ID" checkLabel="중복 확인" />
      </div>
      {/* 비밀번호 입력 필드 */}
      <div className="mb-2">
        <Input label="PASSWORD" type="password" placeholder="PASSWORD" />
      </div>
      {/* 비밀번호 확인 입력 필드 */}
      <div className="mb-2">
        <Input label="PASSWORD CHECK" type="password" placeholder="PASSWORD CHECK" />
      </div>
      {/* 이름 입력 필드 */}
      <div className="mb-2">
        <Input label="NAME" type="text" placeholder="NAME" />
      </div>
      {/* 이메일 입력 필드와 중복 확인 버튼 */}
      <div className="mb-2">
        <Input label="EMAIL" type="email" placeholder="E-MAIL" checkLabel="중복 확인" />
      </div>
      {/* 전화번호 입력 필드 */}
      <div className="mb-2">
        <Input label="PHONE NUMBER" type="text" placeholder="PHONE NUMBER" />
      </div>
      {/* 회원가입 버튼 */}
      <div className="mt-6 mb-2">
        <Button text="회원가입" />
      </div>
    </form>
  );
};

export default JoinForm;
