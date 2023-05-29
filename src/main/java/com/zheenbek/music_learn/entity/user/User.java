package com.zheenbek.music_learn.entity.user;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.zheenbek.music_learn.entity.chat.PrivateChat;
import com.zheenbek.music_learn.entity.course.Course;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Review;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name = "users")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = Long.class)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    @ManyToMany(mappedBy = "participants", fetch = FetchType.EAGER)
    private List<PrivateChat> privateChats;
    @JsonIgnore
    private String password;
    private String firstName;
    private String lastName;
    private String aboutMe;
    @ElementCollection
    private List<String> tags = new ArrayList<>();
    @ManyToMany
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    @JsonIdentityReference(alwaysAsId = true)
    private List<User> followers = new ArrayList<>();
    @ManyToMany(mappedBy = "followers")
    @JsonIdentityReference(alwaysAsId = true)
    private List<User> followings = new ArrayList<>();
    @OneToOne(orphanRemoval = true)
    @JsonIdentityReference(alwaysAsId = true)
    private FileEntity profilePic;
    private Date startDate;

    @OneToMany
    @JsonIdentityReference(alwaysAsId = true)
    private List<Course> publishedCourses = new ArrayList<>();

    @ManyToMany(mappedBy = "enrolledStudents")
    @JsonIdentityReference(alwaysAsId = true)
    private List<Course> takenCourses = new ArrayList<>();

    @ManyToMany(mappedBy = "savedInUsers")
    @JsonIdentityReference(alwaysAsId = true)
    private List<Course> savedCourses = new ArrayList<>();

    @OneToMany
    @JsonIdentityReference(alwaysAsId = true)
    private List<Course> draftCourses = new ArrayList<>();

    @OneToMany
    @JsonIdentityReference(alwaysAsId = true)
    private List<FileEntity> storedFiles = new ArrayList<>();

    @OneToMany
    private List<Review> reviews = new ArrayList<>();

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private List<PrivateChat> privateChats = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user")
    @JsonIgnore
    private Set<Role> authorities = new HashSet<>();

    public User() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
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

    public void setAuthorities(Set<Role> authorities) {
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public FileEntity getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(FileEntity profilePic) {
        this.profilePic = profilePic;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<User> getFollowers() {
        return followers;
    }

    public void setFollowers(List<User> followers) {
        this.followers = followers;
    }

    public List<User> getFollowings() {
        return followings;
    }

    public void setFollowings(List<User> followings) {
        this.followings = followings;
    }

    public List<Course> getPublishedCourses() {
        return publishedCourses;
    }

    public void setPublishedCourses(List<Course> publishedCourses) {
        this.publishedCourses = publishedCourses;
    }

    public List<Course> getTakenCourses() {
        return takenCourses;
    }

    public void setTakenCourses(List<Course> takenCourses) {
        this.takenCourses = takenCourses;
    }

    public List<Course> getSavedCourses() {
        return savedCourses;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<PrivateChat> getPrivateChats() {
        return privateChats;
    }

    public void setPrivateChats(List<PrivateChat> privateChats) {
        this.privateChats = privateChats;
    }

    public List<FileEntity> getStoredFiles() {
        return storedFiles;
    }

    public void setStoredFiles(List<FileEntity> storedFiles) {
        this.storedFiles = storedFiles;
    }

    public List<Course> getDraftCourses() {
        return draftCourses;
    }

    public void setDraftCourses(List<Course> draftCourses) {
        this.draftCourses = draftCourses;
    }

    public void setSavedCourses(List<Course> savedCourses) {
        this.savedCourses = savedCourses;
    }
}