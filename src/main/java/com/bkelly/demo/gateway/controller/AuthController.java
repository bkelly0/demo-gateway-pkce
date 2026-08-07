package com.bkelly.demo.gateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @GetMapping("/auth-status")
  public ResponseEntity<AuthenticationStatusResponse> getAuthStatus() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
      return ResponseEntity.ok(new AuthenticationStatusResponse(true, auth.getName()));
    } else {
      return ResponseEntity.ok(new AuthenticationStatusResponse(false, null));
    }
  }

  public record AuthenticationStatusResponse(boolean authenticated, String username) {}
}
