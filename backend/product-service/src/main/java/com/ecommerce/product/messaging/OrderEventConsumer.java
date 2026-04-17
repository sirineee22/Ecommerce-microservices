package com.ecommerce.product.messaging;

import com.ecommerce.product.config.RabbitMQConfig;
import com.ecommerce.product.dto.OrderEvent;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final ProductRepository productRepository;

    /**
     * Scenario 1: Order created → decrement product stock
     */
    @RabbitListener(queues = RabbitMQConfig.ORDER_CREATED_QUEUE)
    public void handleOrderCreated(OrderEvent event) {
        log.info("Received ORDER_CREATED event: orderId={} productId={} qty={}",
                event.getOrderId(), event.getProductId(), event.getQuantity());

        productRepository.findById(event.getProductId()).ifPresent(product -> {
            int newQty = Math.max(0, product.getQuantity() - event.getQuantity());
            product.setQuantity(newQty);
            productRepository.save(product);
            log.info("Stock decremented for product {}: {} -> {}", 
                    product.getId(), product.getQuantity() + event.getQuantity(), newQty);
        });
    }

    /**
     * Scenario 2: Order cancelled → restore product stock
     */
    @RabbitListener(queues = RabbitMQConfig.ORDER_CANCELLED_QUEUE)
    public void handleOrderCancelled(OrderEvent event) {
        log.info("Received ORDER_CANCELLED event: orderId={} productId={} qty={}",
                event.getOrderId(), event.getProductId(), event.getQuantity());

        productRepository.findById(event.getProductId()).ifPresent(product -> {
            int newQty = product.getQuantity() + event.getQuantity();
            product.setQuantity(newQty);
            productRepository.save(product);
            log.info("Stock restored for product {}: {} -> {}",
                    product.getId(), product.getQuantity() - event.getQuantity(), newQty);
        });
    }
}
