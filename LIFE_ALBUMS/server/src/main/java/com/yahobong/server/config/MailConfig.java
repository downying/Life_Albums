package com.yahobong.server.config;

import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.beans.factory.annotation.Value;

public class MailConfig {

    // application.properties 파일이나 환경 변수에서 값을 가져오기
    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Bean
    public JavaMailSender javaMailService() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();

        javaMailSender.setHost("smtp.gmail.com"); // Gmail의 경우
        javaMailSender.setUsername(username); // 이메일 설정
        javaMailSender.setPassword(password); // 패스워드 설정

        javaMailSender.setPort(587); // Gmail의 경우 TLS는 587번 포트

        javaMailSender.setJavaMailProperties(getMailProperties()); // 메일 인증 서버 정보 설정

        return javaMailSender;
    }

    private Properties getMailProperties() {
        Properties properties = new Properties();
        properties.setProperty("mail.transport.protocol", "smtp"); // 프로토콜 설정
        properties.setProperty("mail.smtp.auth", "true"); // SMTP 인증
        properties.setProperty("mail.smtp.starttls.enable", "true"); // TLS 사용
        properties.setProperty("mail.debug", "true"); // 디버그 사용
        properties.setProperty("mail.smtp.ssl.trust","smtp.gmail.com"); // SSL 인증 서버는 Gmail
        properties.setProperty("mail.smtp.ssl.enable","true"); // SSL 사용
        return properties;
    }

}
