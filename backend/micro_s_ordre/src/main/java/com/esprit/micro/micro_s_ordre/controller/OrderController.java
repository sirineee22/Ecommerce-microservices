package com.esprit.micro.micro_s_ordre.controller;

import com.esprit.micro.micro_s_ordre.client.ProductClient;
import com.esprit.micro.micro_s_ordre.dto.OrderRequest;
import com.esprit.micro.micro_s_ordre.dto.OrderResponse;
import com.esprit.micro.micro_s_ordre.dto.ProductResponse;
import com.esprit.micro.micro_s_ordre.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final ProductClient productClient;

    @PostMapping
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{id}/cancel")
    public OrderResponse cancelOrder(@PathVariable Long id) {
        return orderService.cancelOrder(id);
    }

    /**
     * Scenario 2 (Sync via Feign): Get product details for a specific order
     */
    @GetMapping("/{id}/product")
    public ProductResponse getOrderProduct(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return productClient.getProductById(order.getProductId());
    }

    /**
     * Scenario 3 (Sync via Feign): Check all available products before ordering
     */
    @GetMapping("/available-products")
    public List<ProductResponse> getAvailableProducts() {
        return productClient.getAllProducts();
    }
}