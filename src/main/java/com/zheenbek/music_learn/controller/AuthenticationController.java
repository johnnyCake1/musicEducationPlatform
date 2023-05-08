package com.zheenbek.music_learn.controller;

import com.zheenbek.music_learn.config.JwtUtil;
import com.zheenbek.music_learn.dto.AuthCredsRequest;
import com.zheenbek.music_learn.entity.Role;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.service.RoleService;
import com.zheenbek.music_learn.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpHeaders;
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

import java.time.LocalDate;
import java.util.Date;

@Controller
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final RoleService roleService;

    private final JwtUtil jwtUtil;

    public AuthenticationController(AuthenticationManager authenticationManager,
                                    JwtUtil jwtUtil,
                                    UserService userService,
                                    RoleService roleService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.roleService = roleService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerNewUser(@RequestBody AuthCredsRequest request) {
        if (userService.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("given username is already taken");
        }
        User newUser = new User();
        newUser.setStartDate(new Date());
        newUser.setUsername(request.getUsername());
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        newUser.setPassword(encoder.encode(request.getPassword()));
        newUser = userService.save(newUser);
        roleService.saveRole(newUser, new Role("ROLE_STUDENT"));
        return authenticate(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthCredsRequest request) {
        final User user;
        try {
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            user = (User) authenticate.getPrincipal();
        } catch (AuthenticationException e) {
            return ResponseEntity.status(400).body("failed to authenticate given credentials");
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, jwtUtil.generateToken(user))
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
