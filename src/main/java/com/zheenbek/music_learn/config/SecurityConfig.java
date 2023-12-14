package com.zheenbek.music_learn.config;

import com.zheenbek.music_learn.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ContentSecurityPolicyHeaderWriter;

import java.util.List;

@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
//    private final CorsFilter corsFilter;
    private final UserRepository userRepo;

    @Value("${allowed-origins}")
    private List<String> allowedOrigins;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserRepository userRepo) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userRepo = userRepo;
//        this.corsFilter = corsFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()//.disable()//.configurationSource(corsConfigurationSource())
                .and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/v1/auth/**").permitAll()
                .antMatchers("/files/**").permitAll()
                .antMatchers("/storage/**").permitAll()
                .antMatchers("/chat/**").permitAll()
                .antMatchers("/ws/**", "/ws/info", "/ws/**/info").permitAll()
                // mark those endpoints which do not require authorisation
                .antMatchers(HttpMethod.GET, "/api/v1/courses").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/courses/filter").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/courses/{id}").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/courses/categories/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/courses/categories/{categoryId}").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/courses/categories/{categoryId}/get-courses").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/courses/search/{keyword}").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/courses/{id}/reviews").permitAll() // If reviews can be added without authentication
                .anyRequest().authenticated()
                .and()
                .headers().addHeaderWriter(new ContentSecurityPolicyHeaderWriter("frame-ancestors 'self' " + String.join(" ", allowedOrigins)))
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider())
//                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        final DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
//        return NoOpPasswordEncoder.getInstance(); // this is for testing purpose
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepo.findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException("invalid credentials"));
            }
        };
    }
}
