package com.esprit.micro.micro_s_ordre.dto;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private Double price;
    private Integer stock;
}