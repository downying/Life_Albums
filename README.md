# 프로젝트 Life_Albums
![image](https://github.com/user-attachments/assets/69ba77ee-4a73-4998-b93c-f37402906d9c)

<br><br>

# 목차
**1. 프로젝트 소개**<br>
**2. 프로젝트 구조**<br>
**3. 팀 구성 및 역할**<br>
**4. 프로젝트 기획 과정**<br>
**5. 수행 경과**

<br>

# 1. 프로젝트 소개
## 1-1. 프로젝트 주제<br>
- 인생 앨범 - 개인 앨범 관리 웹 사이트
## 1-2. 주제 선정 배경<br>
- 최근 몇 년간, 소셜미디어와 사진 공유 플랫폼의 발전으로 인해 사람들은 사진을 통해 추억을 기록하고 공유하는 일이 많아짐
- 특히, 네컷사진과 같은 형식의 사진들이 인기를 끌고 있으며 이러한 트렌드를 반영
- 사용자가 자신의 추억을 쉽고 직관적으로 관리할 수 있도록 하는 개인 디지털 앨범의 필요성이 증가
- 이 프로젝트는 사용자가 사진을 효율적으로 관리하고, 과거의 추억을 되돌아 볼 수 있는 기능을 제공하는 디지털 앨범을 개발하고자 
## 1-3. 기획 의도<br>
- 사용자는 네컷사진과 메모를 등록하여 특별한 기억을 앨범으로 정리 할 수 있음 
- 캘린더 기능을 통해 시간 순서대로 추억을 되새길 수 있음
- 즐겨찾기 기능을 통해 중요한 순간을 쉽게 찾아 볼 수 있어 본인에게 특별한 날을 다시 만날 수 있음
- 직관적인 인터페이스로 누구나 쉽고 안전하게 자신의 디지털 추억을 관리할 수 있음
## 1-4. 활용방안 및 기대효과<br>
- 간편한 추억 관리: 사용자는 네컷사진과 메모를 쉽게 등록하고 관리할 수 있어, 중요한 순간을 기억하고 간직하는 일이 간편해짐
- 효율적인 검색 및 정렬: 즐겨찾기 기능을 통해 사용자가 원하는 사진을 신속하게 찾을 수 있음
- 사용자 친화적 인터페이스: 템플릿 선택 및 앨범 UI를 통해 사용자 경험을 극대화하고, 직관적인 디자인을 제공하여 누구나 쉽게 사용 가능
- 안전한 데이터 관리: 로그인을 통해 사용자의 데이터를 안전하게 보호하며, 회원 탈퇴 시 데이터를 안전하게 삭제 가능
- 시간에 따른 사진 정리: 캘린더 기능을 통해 사진을 시간 순서대로 관리할 수 있어, 연대기적으로 추억을 되돌아보는 즐거움을 제공
## 1-5. 간트 차트
<details>
    <summary>✅간트 차트</summary>
  
![image](https://github.com/user-attachments/assets/a87af013-2e5c-4b7d-9c55-9018b920a825)

</details>

<br>

# 2. 프로젝트 구조
## 2-1. 메뉴구조도<br>
<details>
    <summary>✅메뉴구조도</summary>
  
![image](https://github.com/user-attachments/assets/2ca43687-d4cd-4a40-902f-fcfa40c63ca6)

</details>

## 2-1. 플로우 차트<br>
<details>
    <summary>✅플로우 차트</summary>
  
![image](https://github.com/user-attachments/assets/bbf70d17-06af-495e-a41d-a881554e7841)

</details>

<br>

# 3. 팀 구성 및 역할
## 3-1. 팀 구성 및 역할<br>
- 인원 : 4명<br>
- 신봉근
    - 회원가입, 아이디찾기, 비밀번호찾기 페이지 프론트
    - 로그인 페이지 프론트
    - 반응형 페이지(로그인페이지, 앨범 페이지)로 수정
    - 회의록 기록
    - 플로우차트 작성<br>
- 전나연
    - JWT를 사용한 회원가입 및 로그인 기능 개발
    - 회원가입: 사용자 정보를 받아 JWT를 생성하여 반환
    - 로그인: 사용자가 입력한 정보와 데이터베이스의 정보를 비교하여 JWT 발급
    - 인증 미들웨어 구현: JWT의 유효성을 검사하여 접근 제어 구현
    - 아이디 찾기: 사용자 정보를 기반으로 아이디를 찾아 반환
    - 비밀번호 찾기: 사용자가 입력한 이메일로 인증번호를 전송하여 비밀번호 재설정 기능 구현<br>
- 정다운 (팀장)
    - 전체적인 앨범 페이지 디자인 및 기능 구현
    - 앨범 등록/수정/삭제
    - 파일 목록/등록/조회/수정/삭제
    - 캘린더로 모아보기 기능
    - 전체적 오류 수정<br>
- 홍준범
    - 파일 API 
    - 조건별 썸네일 API 
    - API 활용해 프론트엔드 연결 
    - 캘린더 구조 설계
    - 페이징 기능
    - 트러블슈팅
 
<br>

# 4. 프로젝트 기획 과정
## 4-1. 프로젝트 수행 과정<br>
<details>
    <summary>✅수행 과정</summary>
  
![image](https://github.com/user-attachments/assets/a87af013-2e5c-4b7d-9c55-9018b920a825)

</details>

## 4-2. 프로젝트 수행 도구<br>
- 사용 언어 <br>
  + <img src="https://img.shields.io/badge/Java-007396?style=flat&logo=Java&logoColor=white"> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black">
- 프레임워크 <br>
  + <img src="https://img.shields.io/badge/SpringBoot 2.7.17-6DB33F?style=flat&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/>
- 개발도구 <br>
  + <img src="https://img.shields.io/badge/openjdk 17-686767?style=flat&logo=openjdk&logoColor=black"/> <img src="https://img.shields.io/badge/VisualStudioCode-007ACC?style=flat&logo=visualstudiocode&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=white"/>
- 라이브러리 <br>
  + <img src="https://img.shields.io/badge/MyBatis-6DB33F?style=flat&logo=MyBatis&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/>
- 사용 DB
  + <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=white"/> 
- 협업 Tools
  + <img src="https://img.shields.io/badge/github-181717?style=flat&logo=github&logoColor=white"/> <img src="https://img.shields.io/badge/GoogleDrive-4285F4?style=flat&logo=GoogleDrive&logoColor=white"/> <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=Figma&logoColor=white"/>

<br>

# 5. 프로젝트 소개
## 5-1. 기능정의서<br>
<details>
    <summary>✅기능정의서</summary>
  
![image](https://github.com/user-attachments/assets/1ca8c799-2bbe-41e0-9bcc-cd9b5402c047)

</details>

## 5-2. ERD<br>
<details>
    <summary>✅ERD</summary>
  
![image](https://github.com/user-attachments/assets/25eea075-762c-438c-8fbc-e25e6e30c726)

</details>

## 5-2. 테이블 정의서<br>
<details>
    <summary>✅테이블 정의서</summary>
  
![image](https://github.com/user-attachments/assets/43ee6228-1472-4b80-a5e8-275599d49612)
![image](https://github.com/user-attachments/assets/0daf7935-bbab-4e13-a67f-ea3f4d80c884)
![image](https://github.com/user-attachments/assets/b62a0d7c-78aa-4933-877a-a3ce56049f61)

</details>

## 5-2. 화면설게서<br>
<details>
    <summary>✅화면설게서</summary>

![image](https://github.com/user-attachments/assets/8d424632-39db-4c40-a2d4-727cb288feff)
![image](https://github.com/user-attachments/assets/fef442b6-4777-4eb4-889d-ba1666159833)
![image](https://github.com/user-attachments/assets/03e68fef-6a00-4a5e-ac2e-11c84962d5b5)
![image](https://github.com/user-attachments/assets/eaa4141d-5a91-4894-b5b8-c52dd4a9cf32)
![image](https://github.com/user-attachments/assets/da26b17f-acf1-4e14-b0f5-a7e29d2040ce)
![image](https://github.com/user-attachments/assets/12f1e9b6-6ba9-4014-b632-0eb453778ace)
![image](https://github.com/user-attachments/assets/f9ba9821-1f85-45e3-b48f-ea2888a132a4)

</details>

## 5-3. 프로젝트 주소<br>
https://github.com/downying/Life_Albums

</br>

# 6. 개별 평가
## 6-1. 개별 평가<br>
- 신봉근
    - 코딩을 하면서 아직 기본적인 지식이 부족하다는 점을 느끼고 있습니다. 특히,  데이터의 저장, 조회, 관리 등의 기본적인 개념을 더 깊이 공부해야 할 필요가 있습니다.
    - 프론트엔드 작업만 경험해본 것이 아쉽고, 백엔드나 전체적인 풀스택 개발에 대한 경험을 쌓지 못한 점도 한계로 느껴집니다. 페이징 기능을 시도했으나 원하는 대로 구현하지 못한 것이 특히 아쉬웠습니다.
    - 하지만 처음으로 프로젝트에 참여해본 경험은 매우 의미 있었습니다. 팀으로 협업하면서 실제 개발 과정을 배우고, 문제 해결에 대한 다양한 시각을 접할 수 있었습니다. 
    - 테일윈드 CSS를 활용하여 앨범 모양의 UI를 잘 구현해낸 점은 만족스럽습니다. 
    - 또한, 반응형 페이지 설계에 대한 지식을 쌓으면서 다양한 해상도에 맞게 페이지를 최적화하는 경험을 얻은 것은 큰 성과라고 생각합니다.
- 전나연
    - JWT를 활용하여 회원가입과 로그인 기능을 성공적으로 구현하며 사용자 인증 과정에 대한 이해도가 높아졌습니다. 
    - 아이디 찾기와 비밀번호 찾기 기능을 추가함으로써 전체적인 사용자 경험을 향상시켰습니다. 
    - 이메일 인증 기능 구현 시 외부 라이브러리 사용과 SMTP 설정에 대한 실무 경험도 쌓았습니다.  
    - 에러 핸들링 및 사용자 피드백 제공에서 개선이 필요함을 느꼈으며, 향후 보안 관련 사항도 더욱 강화할 계획입니다. 
    - 또한 코드 품질을 높이기 위해 주석 추가 및 리팩토링을 고려해야 한다고 생각합니다.
- 정다운
    - 팀원들이 해결하지 못한 부분을 도와주면서 문제를 해결하여 팀장으로서 책임감을 느꼈습니다.  
    - 처음 프로젝트를 하는 팀원에게 할 수 있는 만큼적절한 방향성과 피드백을 제공하여 성장하는 모습을 보고 뿌듯하였습니다.
    - 정기적인 회의를 통해 각자의 진행 상황을 공유하고, 서로의 의견을 나누는 시간을 가졌습니다. 이러한 소통을 통해 팀원들이 더 편안하게 질문하고, 어려운 부분을 함께 고민할 수 있는 환경을 조성했습니다. 또한, 필요한 자료나 정보를 빠르게 찾아 공유함으로써 팀원들이 각자의 역할에 집중할 수 있도록 도왔습니다.
    - 하지만, 미니 프로젝트로 단기간 수행하려 하였으나 비대면 프로젝트로 인해 기간이 길어진 것과 완벽하게 마무리 하지 못해 아쉬움이 남습니다. 차후 코드를 보완해가며 완성하는 것이 필요하다고 느꼈습니다. 
- 홍준범
    - 스프린트 기간을 정하지 않아 효율적으로 업무를 진행하지 못한 부분이 아쉬웠습니다. 
    - 배포까지 완벽하게 마무리하지 못한 점도 개선이 필요하다고 느꼈습니다. 

