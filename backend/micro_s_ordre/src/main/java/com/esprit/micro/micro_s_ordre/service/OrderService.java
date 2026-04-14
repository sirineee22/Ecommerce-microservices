package com.esprit.micro.micro_s_ordre.service;

import com.esprit.micro.micro_s_ordre.dto.OrderRequest;
import com.esprit.micro.micro_s_ordre.dto.OrderResponse;
import com.esprit.micro.micro_s_ordre.entities.Order;
import com.esprit.micro.micro_s_ordre.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    // ← PAS de ProductClient ici

    public OrderResponse createOrder(OrderRequest request) {
        double totalPrice = (request.getUnitPrice() != null)
                ? request.getUnitPrice() * request.getQuantity()
                : 0.0;

        Order order = Order.builder()
                .userId(request.getUserId())
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .totalPrice(totalPrice)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .productId(order.getProductId())
                .quantity(order.getQuantity())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .build();
    }
}