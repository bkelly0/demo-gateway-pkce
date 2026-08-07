package com.bkelly.demo.gateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@Configuration
@Profile("database")
@EnableRedisHttpSession(
    maxInactiveIntervalInSeconds = 900,
    redisNamespace = "demo-auth-gateway:session")
public class RedisSessionConfig {}
