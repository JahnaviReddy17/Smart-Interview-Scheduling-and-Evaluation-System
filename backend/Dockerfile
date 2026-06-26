# Stage 1 — Build the JAR
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2 — Run the JAR
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


On Fri, Jun 26, 2026 at 7:29 PM Jahnavi Reddy <jahnavi1776@gmail.com> wrote:
services:
  - type: web
    name: sies-backend
    runtime: java
    rootDir: backend
    buildCommand: mvn clean package -DskipTests
    startCommand: java -jar target/backend-1.0.0.jar
    plan: free
    envVars:
      - key: DB_URL
        sync: false
      - key: DB_USERNAME
        sync: false
      - key: DB_PASSWORD
        sync: false
      - key: MAIL_USERNAME
        sync: false
      - key: MAIL_PASSWORD
        sync: false
      - key: GEMINI_API_KEY
        sync: false

databases:
  - name: sies-db
    databaseName: smartinterview
    plan: free





package com.smartinterview.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://sies-frontend-kohl.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}





import axios from 'axios'

const api = axios.create({
  baseURL: 'https://sies-backend.onrender.com/api',   // ← your Render URL
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api


On Fri, Jun 26, 2026 at 6:54 PM Jahnavi Reddy <jahnavi1776@gmail.com> wrote:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

On Fri, Jun 26, 2026 at 6:32 PM Jahnavi Reddy <jahnavi1776@gmail.com> wrote:
 SmartInterview_and_Evaluation_System-main.zip