package com.esprit.micro.micro_s_ordre.client;

import com.esprit.micro.micro_s_ordre.config.FeignConfig;
import com.esprit.micro.micro_s_ordre.dto.ProductResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", configuration = FeignConfig.class)
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ProductResponse getProductById(@PathVariable("id") Long id);
}