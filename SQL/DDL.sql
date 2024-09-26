DROP TABLE files;
DROP TABLE albums;
DROP TABLE users;


-- users 테이블
CREATE TABLE `users` (
    `userNo`  INT           NOT NULL AUTO_INCREMENT,
    `id`      VARCHAR(100)  NOT NULL,
    `pw`      VARCHAR(100)  NOT NULL,
    `name`    VARCHAR(100)  NOT NULL,
    `mail`    VARCHAR(50)   NOT NULL,
    `phone`   VARCHAR(50)   NOT NULL,
    `resetToken`        VARCHAR(255),       -- 비밀번호 재설정을 위한 인증번호 또는 토큰
    `resetTokenExpiry`  DATETIME,           -- 인증번호의 만료 시간
    PRIMARY KEY (`userNo`)
) COMMENT='유저';

CREATE TABLE `albums` (
    `albumsNo`  INT           NOT NULL AUTO_INCREMENT,
    `userNo`    INT           NOT NULL,
    `title`     VARCHAR(100)  NULL,
    PRIMARY KEY (`albumsNo`),
    FOREIGN KEY (`userNo`) REFERENCES `users`(`userNo`) ON UPDATE CASCADE ON DELETE CASCADE
) COMMENT='앨범';

CREATE TABLE `files` (
    `fileNo`    INT            NOT NULL AUTO_INCREMENT,
    `albumsNo`  INT            NOT NULL,
    `content`   VARCHAR(255)   NULL,
    `year`      INT            NULL,
    `month`     INT            NULL,
    `day`       INT            NULL,
    `star`      BOOLEAN            NULL,
    `regDate`   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `filePath`  VARCHAR(255)   NOT NULL,
    PRIMARY KEY (`fileNo`),
    FOREIGN KEY (`albumsNo`) REFERENCES `albums`(`albumsNo`) ON UPDATE CASCADE ON DELETE CASCADE
) COMMENT='사진';

-- 아이디 : user 비밀번호: 123456
INSERT INTO users (id, pw, name, mail, phone)
VALUES ('user', '$2a$12$TrN..KcVjciCiz.5Vj96YOBljeVTTGJ9AUKmtfbGpgc9hmC7BxQ92', '야호봉','asdf123@naver.com', '01077884455');