package com.esprit.micro.micro_s_ordre.repository;


import com.esprit.micro.micro_s_ordre.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}