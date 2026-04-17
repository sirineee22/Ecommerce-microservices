package com.esprit.micro.micro_s_ordre.service;

import com.esprit.micro.micro_s_ordre.client.ProductClient;
import com.esprit.micro.micro_s_ordre.config.RabbitMQConfig;
import com.esprit.micro.micro_s_ordre.dto.OrderEvent;
import com.esprit.micro.micro_s_ordre.dto.OrderRequest;
import com.esprit.micro.micro_s_ordre.dto.OrderResponse;
import com.esprit.micro.micro_s_ordre.dto.ProductResponse;
import com.esprit.micro.micro_s_ordre.entities.Order;
import com.esprit.micro.micro_s_ordre.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ProductClient productClient;

    /**
     * Scenario 1 (Sync via Feign): Validate product exists before creating order
     * Scenario 1 (Async via RabbitMQ): Publish ORDER_CREATED event after save
     */
    public OrderResponse createOrder(OrderRequest request) {
        // Feign call: validate product exists and get price
        ProductResponse product = productClient.getProductById(request.getProductId());

        double unitPrice = (request.getUnitPrice() != null)
                ? request.getUnitPrice()
                : product.getPrice();

        double totalPrice = unitPrice * request.getQuantity();

        Order order = Order.builder()
                .userId(request.getUserId())
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .totalPrice(totalPrice)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        Order saved = orderRepository.save(order);

        // Publish async event to RabbitMQ
        OrderEvent event = new OrderEvent(
                saved.getId(),
                saved.getProductId(),
                saved.getQuantity(),
                request.getUnitPrice(),
                "CREATED"
        );
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ORDER_EXCHANGE,
                RabbitMQConfig.ORDER_CREATED_KEY,
                event
        );
        log.info("Published ORDER_CREATED event for order {} product {}", saved.getId(), saved.getProductId());

        return toResponse(saved);
    }

    /**
     * Scenario 2 (Async): Cancel order and publish ORDER_CANCELLED event to RabbitMQ
     * → product-service will restore stock
     */
    public OrderResponse cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setStatus("CANCELLED");
        Order saved = orderRepository.save(order);

        // Publish async event to RabbitMQ
        OrderEvent event = new OrderEvent(
                saved.getId(),
                saved.getProductId(),
                saved.getQuantity(),
                saved.getTotalPrice() / saved.getQuantity(),
                "CANCELLED"
        );
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ORDER_EXCHANGE,
                RabbitMQConfig.ORDER_CANCELLED_KEY,
                event
        );
        log.info("Published ORDER_CANCELLED event for order {} product {}", saved.getId(), saved.getProductId());

        return toResponse(saved);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        return toResponse(order);
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
