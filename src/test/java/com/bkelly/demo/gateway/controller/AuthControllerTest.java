package com.bkelly.demo.gateway.controller;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

class AuthControllerTest {

  private final AuthController controller = new AuthController();

  @BeforeEach
  void clearSecurityContext() {
    SecurityContextHolder.clearContext();
  }

  @AfterEach
  void resetSecurityContext() {
    SecurityContextHolder.clearContext();
  }

  @Test
  void getAuthStatusReturnsUnauthenticatedWhenNoUserIsPresent() {
    ResponseEntity<AuthController.AuthenticationStatusResponse> response =
        controller.getAuthStatus();
    AuthController.AuthenticationStatusResponse body = response.getBody();

    assertAll(
        () -> assertEquals(200, response.getStatusCode().value()),
        () -> assertNotNull(body),
        () -> assertFalse(body.authenticated()),
        () -> assertNull(body.username()));
  }

  @Test
  void getAuthStatusReturnsAuthenticatedUserNameWhenUserIsPresent() {
    SecurityContextHolder.getContext()
        .setAuthentication(
            new UsernamePasswordAuthenticationToken(
                "alice", "password", List.of(new SimpleGrantedAuthority("ROLE_USER"))));

    ResponseEntity<AuthController.AuthenticationStatusResponse> response =
        controller.getAuthStatus();
    AuthController.AuthenticationStatusResponse body = response.getBody();

    assertAll(
        () -> assertEquals(200, response.getStatusCode().value()),
        () -> assertNotNull(body),
        () -> assertTrue(body.authenticated()),
        () -> assertEquals("alice", body.username()));
  }

  @Test
  void getAuthStatusTreatsAnonymousAuthenticationAsUnauthenticated() {
    SecurityContextHolder.getContext()
        .setAuthentication(
            new AnonymousAuthenticationToken(
                "key", "anonymousUser", List.of(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))));

    ResponseEntity<AuthController.AuthenticationStatusResponse> response =
        controller.getAuthStatus();
    AuthController.AuthenticationStatusResponse body = response.getBody();

    assertAll(
        () -> assertEquals(200, response.getStatusCode().value()),
        () -> assertNotNull(body),
        () -> assertFalse(body.authenticated()),
        () -> assertNull(body.username()));
  }
}
