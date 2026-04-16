package com.esprit.micro.micro_s_ordre.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Long userId;
    private Long productId;
    private Integer quantity;
    private Double unitPrice;  // ← ajouter ce champ
}