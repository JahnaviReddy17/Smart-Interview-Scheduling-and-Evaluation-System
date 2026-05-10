package com.smartinterview.dto;

import com.smartinterview.entity.User;

public class CreateUserRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private User.Role role;
    private String department;

    public CreateUserRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
