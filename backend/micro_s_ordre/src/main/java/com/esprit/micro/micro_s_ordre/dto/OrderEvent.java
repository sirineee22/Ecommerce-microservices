package com.esprit.micro.micro_s_ordre.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderEvent {
    private Long orderId;
    private Long productId;
    private Integer quantity;
    private Double unitPrice;
    private String status; // CREATED, CANCELLED
}
