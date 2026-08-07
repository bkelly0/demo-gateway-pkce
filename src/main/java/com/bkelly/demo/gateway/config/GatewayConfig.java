package com.bkelly.demo.gateway.config;

import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.filter.TokenRelayFilterFunctions.tokenRelay;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.IdTokenCredentials;
import com.google.auth.oauth2.IdTokenProvider;
import java.io.IOException;
import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

/**
 * Configures the spring gateway. This needs to be a java config instead of properties due to the
 * addGoogleInvokerToken
 */
@Configuration
public class GatewayConfig {

  @Bean
  RouterFunction<ServerResponse> gatewayRouteA(
      @Value("${app.resource-server-uri}") URI resourceUri,
      HandlerFilterFunction<ServerResponse, ServerResponse> addGoogleInvokerToken) {

    return route("backend-api-a")
        .route(path("/api/a/v1/**"), http())
        .before(uri(resourceUri))
        .filter(tokenRelay())
        .filter(addGoogleInvokerToken)
        .build();
  }

  @Bean
  RouterFunction<ServerResponse> gatewayRouteB(
      @Value("${app.resource-server-uri}") URI resourceUri,
      HandlerFilterFunction<ServerResponse, ServerResponse> addGoogleInvokerToken) {

    return route("backend-api-b")
        .route(path("/api/b/v1/**"), http())
        .before(uri(resourceUri))
        .filter(tokenRelay())
        .filter(addGoogleInvokerToken)
        .build();
  }

  // uses the Authorization header for Google auth and a custom header for user auth
  @Bean
  HandlerFilterFunction<ServerResponse, ServerResponse> addGoogleInvokerToken(
      @Value("${app.enable-google-auth}") boolean enableGoogleAuth,
      @Value("${app.resource-server-uri}") String audience,
      @Value("${app.user-token-header}") String userTokenHeader) {

    return (request, next) -> {
      String userAuth = request.headers().firstHeader(HttpHeaders.AUTHORIZATION);
      ServerRequest mutated =
          ServerRequest.from(request)
              .headers(
                  h -> {
                    if (userAuth != null) h.set(userTokenHeader, userAuth);
                    if (enableGoogleAuth) {
                      try {
                        h.setBearerAuth(getGoogleIdToken(audience)); // replaces Authorization
                      } catch (IOException e) {
                        throw new RuntimeException(e);
                      }
                    }
                  })
              .build();

      return next.handle(mutated);
    };
  }

  // return an empty optional for use without Google service account authorization
  protected String getGoogleIdToken(String audience) throws IOException {
    GoogleCredentials adc = GoogleCredentials.getApplicationDefault();
    IdTokenCredentials id =
        IdTokenCredentials.newBuilder()
            .setIdTokenProvider((IdTokenProvider) adc)
            .setTargetAudience(audience)
            .build();

    return id.refreshAccessToken().getTokenValue();
  }
}
