package com.ecommerce.delivery.repository;

import com.ecommerce.delivery.model.Delivery;
import com.ecommerce.delivery.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByOrderId(Long orderId);
    List<Delivery> findByDeliveryStatus(DeliveryStatus status);
    Optional<Delivery> findByTrackingNumber(String trackingNumber);
}
