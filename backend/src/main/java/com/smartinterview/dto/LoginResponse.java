package com.smartinterview.dto;

public class LoginResponse {
    private String token;
    private String role;
    private String username;
    private String fullName;
    private Long userId;

    public LoginResponse() {}

    public LoginResponse(String token, String role, String username, String fullName, Long userId) {
        this.token = token;
        this.role = role;
        this.username = username;
        this.fullName = fullName;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
