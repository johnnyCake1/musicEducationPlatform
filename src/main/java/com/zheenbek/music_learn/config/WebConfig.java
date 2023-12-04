package com.zheenbek.music_learn.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${allowed-origins}")
    private List<String> allowedOrigins;
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:src/main/storage/files/")
                .addResourceLocations("file:src/main/resources/static/")
                .setCachePeriod(86400); // Set cache period to 86400 seconds (24 hours)
    }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] originsArray = allowedOrigins.toArray(new String[0]);
        registry.addMapping("/**")
                .allowedOrigins(originsArray)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}


