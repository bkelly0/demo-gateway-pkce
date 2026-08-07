package com.bkelly.demo.gateway.config;

import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final CorsProperties corsProperties;

  @Bean
  SecurityFilterChain securityFilterChain(
      HttpSecurity http, LogoutSuccessHandler logoutSuccessHandler) {
    return http.csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(
                        "/",
                        "/index.html",
                        "/assets/**",
                        "/favicon.ico",
                        "/manifest.webmanifest",
                        "/oauth2/**",
                        "/login/**",
                        "/api/auth/login",
                        "/api/auth/auth-status")
                    .permitAll()
                    .requestMatchers("/api/**")
                    .authenticated()
                    .anyRequest()
                    .permitAll())
        .oauth2Login(
            oauth ->
                oauth.defaultSuccessUrl("/protected", true).failureUrl("/login?error=login_failed"))
        .exceptionHandling(
            ex -> ex.authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login")))
        .logout(
            logout ->
                logout
                    .logoutUrl("/api/logout")
                    .logoutSuccessHandler(logoutSuccessHandler)
                    .invalidateHttpSession(true)
                    .clearAuthentication(true))
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(corsProperties.getAllowedOrigins());
    config.setAllowedMethods(corsProperties.getAllowedMethods());
    config.setAllowedHeaders(corsProperties.getAllowedHeaders());
    config.setAllowCredentials(corsProperties.getAllowCredentials());
    config.setMaxAge(corsProperties.getMaxAge());

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  @Bean
  LogoutSuccessHandler oidcLogoutSuccessHandler(
      ClientRegistrationRepository repo,
      @Value("${app.post-logout-redirect-uri}") String postLogoutRedirectUri) {
    var handler = new OidcClientInitiatedLogoutSuccessHandler(repo);
    handler.setPostLogoutRedirectUri(postLogoutRedirectUri);
    return handler;
  }
}
