import React, { useState, useContext } from 'react';
import Input from '../../components/user/Input';
import Button from '../../components/user/Button';
import { useNavigate } from 'react-router-dom';
import { checkId, checkMail, join } from '../../apis/user/auth';
import { LoginContext } from '../../components/LoginProvider';
import Checkbox from '../../components/user/Checkbox';

const JoinForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberId, setRememberId] = useState(false);

  const [idExists, setIdExists] = useState(null);
  const [mailExists, setMailExists] = useState(null);
  const [formError, setFormError] = useState('');
  const [isMailValid, setIsMailValid] = useState(false); // 이메일 유효성 여부 상태 추가

  // 정규식 정의
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^01[016789]\d{7,8}$/;  // 한국 핸드폰 번호 형식

  // ID 중복 확인
  const handleCheckId = async () => {
    if (!id) {
      alert('ID를 입력해주세요.');
      return;
    }
    try {
      const exists = await checkId(id);
      setIdExists(exists.data.exists);
      if (exists.data.exists) {
        alert('ID가 이미 사용 중입니다.');
      } else {
        alert('사용 가능한 ID입니다.');
      }
    } catch (error) {
      console.error('ID 중복 확인 오류:', error);
    }
  };

  // 이메일 중복 확인
  const handleCheckMail = async () => {
    if (!mail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    // 이메일 유효성 검사
    if (!isMailValid) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    try {
      const exists = await checkMail(mail);
      setMailExists(exists.data.exists);
      if (exists.data.exists) {
        alert('이메일이 이미 사용 중입니다.');
      } else {
        alert('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
    }
  };

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ID 중복 확인을 아직 하지 않았다면 강제 실행
    if (idExists === null) {
      await handleCheckId();
      if (idExists === null || idExists === true) {
        return; // ID 중복 확인 후, 중복이 있거나 확인되지 않았으면 종료
      }
    }

    if (mailExists === null) {
      await handleCheckMail();
      if (mailExists === null || mailExists === true) {
        return; // 이메일 중복 확인 후, 중복이 있거나 확인되지 않았으면 종료
      }
    }

    // 전체 폼 유효성 검사
    if (!id || !pw || !pwCheck || !name || !mail || !phone) {
      setFormError('모든 필드를 채워주세요.');
      return;
    }

    // 핸드폰 번호 유효성 검사
    if (!phoneRegex.test(phone)) {
      setFormError('유효한 핸드폰 번호를 입력해주세요. (숫자만 입력)');
      return;
    }

    // 비밀번호 일치 확인
    if (pw !== pwCheck) {
      setFormError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setFormError(''); // 에러 메시지 초기화

    try {
      const response = await join({ id, pw, name, mail, phone });

      if (response.status === 200) {
        alert('회원가입이 완료되었습니다.');
        login(id, pw, rememberId, navigate); // 로그인 후 이동
      } else if (response.status === 409) {
        alert(response.data); // 서버에서 반환된 메시지를 표시
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('접근 권한이 없습니다. 관리자에게 문의하세요.');
      } else {
        alert('회원가입 중 문제가 발생했습니다.');
        console.error('회원가입 오류:', error);
      }
    }
  };

  // 이메일 입력 시 유효성 검사
  const handleMailChange = (e) => {
    const value = e.target.value;
    setMail(value);
    setIsMailValid(emailRegex.test(value)); // 이메일 유효성 검사 결과 저장
    setMailExists(null); // 이메일이 변경되면 중복 확인 초기화
  };

  return (
    <form className="w-full max-w-sm mx-auto mt-4 p-4" onSubmit={handleSubmit}>
      {/* ID 입력 필드와 중복 확인 버튼 */}
      <div className="mb-2">
        <Input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setIdExists(null); // ID가 변경되면 중복 확인 초기화
          }}
          checkLabel="중복 확인"
          onCheckClick={handleCheckId} // onCheckClick로 연결 변경
        />
      </div>

      {/* 비밀번호 입력 필드 */}
      <div className="mb-2">
        <Input
          type="password"
          placeholder="PASSWORD"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div className="mb-2">
        <Input
          type="password"
          placeholder="PASSWORD CHECK"
          value={pwCheck}
          onChange={(e) => setPwCheck(e.target.value)}
        />
      </div>

      {/* 이름 입력 필드 */}
      <div className="mb-2">
        <Input
          type="text"
          placeholder="NAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* 이메일 입력 필드와 중복 확인 버튼 */}
      <div className="mb-2">
        <Input
          type="email"
          placeholder="E-MAIL"
          value={mail}
          onChange={handleMailChange} // 이메일 유효성 검사 포함
          checkLabel="중복 확인"
          onCheckClick={handleCheckMail} // onCheckClick로 연결 변경
          disabled={!isMailValid}  // 이메일 유효성 검사 통과 시에만 중복 확인 가능
        />
      </div>

      {/* 전화번호 입력 필드 */}
      <div className="mb-2">
        <Input
          type="text"
          placeholder="PHONE NUMBER"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* ID 기억 여부 체크박스 */}
      <div className="mb-4 flex justify-center items-center"> 
        <Checkbox 
          label="아이디 저장" 
          className="text-sm" 
          checked={rememberId}  // 체크박스 상태 전달
          onChange={(e) => setRememberId(e.target.checked)}  // 체크박스 상태 변경 처리
        /> 
      </div>

      {/* 회원가입 버튼 */}
      <div className="mt-6 mb-2">
        <Button text="회원가입" />
      </div>

      {/* 폼 에러 메시지 출력 */}
      {formError && <p className="text-red-500">{formError}</p>}
    </form>
  );
};

export default JoinForm;
