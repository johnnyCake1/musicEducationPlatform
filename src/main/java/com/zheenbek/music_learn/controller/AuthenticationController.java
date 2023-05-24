package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.config.JwtUtil;
import com.zheenbek.music_learn.dto.AuthCredsRequest;
import com.zheenbek.music_learn.dto.UserDTO;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Role;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.service.RoleService;
import com.zheenbek.music_learn.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@Controller
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthenticationController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping ResponseEntity<String> helloWorld(){
        return new ResponseEntity<>("Hello World!", HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerNewUser(@RequestBody AuthCredsRequest request) {
        if (userService.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("given username is already taken");
        }
        userService.createNewUser(request.getUsername(), request.getPassword());
        return authenticate(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthCredsRequest request) {
        final UserDTO user;
        try {
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            user = UserService.convertToUserDTO((User) authenticate.getPrincipal());
        } catch (AuthenticationException e) {
            return ResponseEntity.status(400).body("failed to authenticate given credentials");
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, jwtUtil.generateToken(user.getUsername(), user.getAuthorities()))
                .body(user);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token, @AuthenticationPrincipal User user) {
        try {
            Boolean isTokenValid = jwtUtil.validateToken(token, user);
            return ResponseEntity.ok(isTokenValid);
        } catch (ExpiredJwtException e) {
            return ResponseEntity.ok(false);
        }
    }
}
