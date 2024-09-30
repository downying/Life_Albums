package com.yahobong.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /upload/** URL로 접근 시 C:/upload 경로의 파일을 제공
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:///C:/upload/")
                .addResourceLocations("file:/Users/apnalchangchanghongjunbeom/upload/")
                .addResourceLocations("file:/Users/yeon/upload/");
    }
}
