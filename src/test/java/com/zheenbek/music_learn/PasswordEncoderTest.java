package com.zheenbek.music_learn;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncoderTest {
    @Test
    public void encodePassword() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String encoded = encoder.encode("my_dummy_password_1");
    }
}
