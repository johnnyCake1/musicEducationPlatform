package com.zheenbek.music_learn.entities;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "users")
public class User implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;

    private String username;

    private String password;

    //TODO: implement without having different role states
//    private boolean hasTeacherRole;
//
//    private boolean hasStudentRole;
//
//    private boolean hasAdminRole;

    private boolean hasUserRole;

    public User () {}

    public User (String username, String password, LocalDate startDate, Set<Role> roles) {
        this.username = username;
        this.password = password;
        this.startDate = startDate;
        //TODO: implement without having different role states
        this.hasUserRole = true;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<Role> roles = new HashSet<>();
        if (hasUserRole) {
            roles.add(new Role("ROLE_USER"));
        }
        //TODO: implement without having different role states
//        if (hasAdminRole) {
//            roles.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
//        }
//        if (hasStudentRole) {
//            roles.add(new SimpleGrantedAuthority("ROLE_STUENT"));
//        }
//        if (hasTeacherRole) {
//            roles.add(new SimpleGrantedAuthority("ROLE_TEACHER"));
//        }
        return roles;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    //TODO: implement without having different role states
//    public boolean isHasTeacherRole() {
//        return hasTeacherRole;
//    }
//
//    public void setHasTeacherRole(boolean hasTeacherRole) {
//        this.hasTeacherRole = hasTeacherRole;
//    }
//
//    public boolean isHasStudentRole() {
//        return hasStudentRole;
//    }
//
//    public void setHasStudentRole(boolean hasStudentRole) {
//        this.hasStudentRole = hasStudentRole;
//    }
//
//    public boolean isHasAdminRole() {
//        return hasAdminRole;
//    }
//
//    public void setHasAdminRole(boolean hasAdminRole) {
//        this.hasAdminRole = hasAdminRole;
//    }

    public boolean hasUserRole() {
        return hasUserRole;
    }

    public void setHasUserRole(boolean hasUserRole) {
        this.hasUserRole = hasUserRole;
    }
}
