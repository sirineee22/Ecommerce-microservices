package com.esprit.micro.micro_s_ordre.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders") // <-- ne pas utiliser 'order', utiliser 'orders' ou 'order_table'

public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long productId;

    private Integer quantity;

    private Double totalPrice;

    private String status;

    private LocalDateTime createdAt;
}