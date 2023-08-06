package com.coffeeshop.gatewayservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.GatewayFilterSpec;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.gateway.route.builder.UriSpec;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.function.Function;

@Configuration
@EnableHystrix
@CrossOrigin(origins = "http://localhost:3000")
public class GatewayConfig {
    @Autowired
    AuthenticationFilter filter;

    @Bean
    Function<GatewayFilterSpec, UriSpec> brutalCorsFilters() {
        return f -> f
                .setResponseHeader("Access-Control-Allow-Origin", "*")
                .setResponseHeader("Access-Control-Allow-Methods", "*")
                .setResponseHeader("Access-Control-Expose-Headers", "*");
    }
    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder, Function<GatewayFilterSpec, UriSpec> brutalCorsFilters) {
        return builder.routes()
                .route("order-service", r -> r.path("/api/orders/**")
                        .filters(brutalCorsFilters)
                        //.filters(f -> f.filter(filter))
                        .uri("lb://order-service"))

                .route("core-service", r -> r.path("/api/**")
                        .filters(brutalCorsFilters)
                        //.filters(f -> f.filter(filter))
                        .uri("lb://core-service"))
                .build();
    }
}
