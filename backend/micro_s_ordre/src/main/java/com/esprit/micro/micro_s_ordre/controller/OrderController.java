package com.esprit.micro.micro_s_ordre.controller;

import com.esprit.micro.micro_s_ordre.dto.OrderRequest;
import com.esprit.micro.micro_s_ordre.dto.OrderResponse;
import com.esprit.micro.micro_s_ordre.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }
}