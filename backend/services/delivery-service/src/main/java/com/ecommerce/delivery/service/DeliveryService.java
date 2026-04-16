package com.ecommerce.delivery.service;

import com.ecommerce.delivery.dto.DeliveryRequest;
import com.ecommerce.delivery.exception.BusinessException;
import com.ecommerce.delivery.exception.ResourceNotFoundException;
import com.ecommerce.delivery.model.Delivery;
import com.ecommerce.delivery.model.DeliveryStatus;
import com.ecommerce.delivery.repository.DeliveryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    public Delivery create(DeliveryRequest request) {
        if (request.getTrackingNumber() != null && deliveryRepository.findByTrackingNumber(request.getTrackingNumber()).isPresent()) {
            throw new BusinessException("Tracking number already exists.");
        }
        Delivery delivery = new Delivery();
        mapRequestToDelivery(request, delivery);
        delivery.setDeliveryStatus(DeliveryStatus.PENDING);
        return deliveryRepository.save(delivery);
    }

    public List<Delivery> findAll() {
        return deliveryRepository.findAll();
    }

    public Delivery findById(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery with id " + id + " not found."));
    }

    public List<Delivery> findByOrderId(Long orderId) {
        return deliveryRepository.findByOrderId(orderId);
    }

    public List<Delivery> findByStatus(DeliveryStatus status) {
        return deliveryRepository.findByDeliveryStatus(status);
    }

    @Transactional
    public Delivery update(Long id, DeliveryRequest request) {
        Delivery existing = findById(id);
        if (request.getTrackingNumber() != null) {
            deliveryRepository.findByTrackingNumber(request.getTrackingNumber())
                    .ifPresent(found -> {
                        if (!found.getId().equals(existing.getId())) {
                            throw new BusinessException("Tracking number already exists.");
                        }
                    });
        }
        mapRequestToDelivery(request, existing);
        return deliveryRepository.save(existing);
    }

    public void delete(Long id) {
        Delivery existing = findById(id);
        deliveryRepository.delete(existing);
    }

    @Transactional
    public Delivery updateStatus(Long id, DeliveryStatus targetStatus) {
        Delivery existing = findById(id);
        validateTransition(existing.getDeliveryStatus(), targetStatus);
        existing.setDeliveryStatus(targetStatus);
        if (targetStatus == DeliveryStatus.DELIVERED) {
            existing.setActualDeliveryDate(LocalDate.now());
        }
        return deliveryRepository.save(existing);
    }

    private void mapRequestToDelivery(DeliveryRequest request, Delivery delivery) {
        delivery.setOrderId(request.getOrderId());
        delivery.setCustomerId(request.getCustomerId());
        delivery.setAddress(request.getAddress());
        delivery.setCity(request.getCity());
        delivery.setPostalCode(request.getPostalCode());
        delivery.setCountry(request.getCountry());
        delivery.setCarrier(request.getCarrier());
        delivery.setTrackingNumber(request.getTrackingNumber());
        delivery.setEstimatedDeliveryDate(request.getEstimatedDeliveryDate());
    }

    private void validateTransition(DeliveryStatus current, DeliveryStatus target) {
        if (current == target) {
            return;
        }
        boolean valid =
                (current == DeliveryStatus.PENDING && (target == DeliveryStatus.ASSIGNED || target == DeliveryStatus.CANCELLED)) ||
                (current == DeliveryStatus.ASSIGNED && (target == DeliveryStatus.IN_TRANSIT || target == DeliveryStatus.CANCELLED)) ||
                (current == DeliveryStatus.IN_TRANSIT && target == DeliveryStatus.DELIVERED);
        if (!valid) {
            throw new BusinessException("Invalid status transition from " + current + " to " + target + ".");
        }
    }
}
