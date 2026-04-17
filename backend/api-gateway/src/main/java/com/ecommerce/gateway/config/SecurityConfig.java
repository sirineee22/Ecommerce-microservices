package com.ecommerce.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.oauth2.server.resource.web.server.authentication.ServerBearerTokenAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private static final List<String> PUBLIC_PREFIXES = List.of(
        "/product-service/api/products",
        "/forum-service/",
        "/event-service/",
        "/delivery-service/",
        "/eureka/",
        "/swagger-ui",
        "/v3/api-docs",
        "/webjars/"
    );

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeExchange(exchange -> exchange
                .pathMatchers(
                    "/product-service/api/products",
                    "/product-service/api/products/**",
                    "/forum-service/**",
                    "/event-service/**",
                    "/delivery-service/**",
                    "/eureka/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/webjars/**"
                ).permitAll()
                .pathMatchers(HttpMethod.POST, "/product-service/api/products").hasRole("ADMIN")
                .pathMatchers(HttpMethod.PUT, "/product-service/api/products/**").hasRole("ADMIN")
                .pathMatchers(HttpMethod.DELETE, "/product-service/api/products/**").hasRole("ADMIN")
                .pathMatchers(HttpMethod.GET, "/order-service/api/orders").hasRole("ADMIN")
                .pathMatchers(HttpMethod.PUT, "/order-service/api/orders/**").hasRole("ADMIN")
                .pathMatchers(HttpMethod.POST, "/order-service/api/orders").authenticated()
                .pathMatchers("/order-service/**").authenticated()
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .bearerTokenConverter(this::extractTokenSkippingPublicRoutes)
            );
        return http.build();
    }

    /**
     * Custom token extractor: skip token extraction on public routes.
     * This prevents Spring Security from validating (and rejecting) tokens
     * on routes that should be publicly accessible.
     */
    private Mono<org.springframework.security.core.Authentication> extractTokenSkippingPublicRoutes(
            ServerWebExchange exchange) {
        String path = exchange.getRequest().getPath().value();
        boolean isPublic = PUBLIC_PREFIXES.stream().anyMatch(path::startsWith);
        if (isPublic) {
            return Mono.empty(); // No token extraction → no validation → request passes
        }
        return new ServerBearerTokenAuthenticationConverter().convert(exchange);
    }

    @Bean
    public ReactiveJwtAuthenticationConverterAdapter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);

        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        config.setAllowedHeaders(Collections.singletonList("*"));
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
