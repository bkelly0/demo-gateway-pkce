package com.bkelly.demo.gateway.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
public class SpaForwardController implements ErrorController {

  @GetMapping({"/", "/login", "/about", "/protected"})
  public String forward() {
    return "forward:/index.html";
  }

  @RequestMapping("/error")
  public String handleError(HttpServletRequest request) {
    Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
    Object uri = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
    log.error("Error: {} {}", status, uri);

    if (uri instanceof String path && !path.startsWith("/api/")) {
      return "forward:/index.html";
    }

    return "forward:/";
  }

  @GetMapping("/protected")
  public String forwardProtected() {
    return "forward:/index.html";
  }
}
