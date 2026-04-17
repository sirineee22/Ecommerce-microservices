package com.esprit.micro.micro_s_ordre.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange
    public static final String ORDER_EXCHANGE = "order.exchange";

    // Queues
    public static final String ORDER_CREATED_QUEUE = "order.created.queue";
    public static final String ORDER_CANCELLED_QUEUE = "order.cancelled.queue";

    // Routing keys
    public static final String ORDER_CREATED_KEY = "order.created";
    public static final String ORDER_CANCELLED_KEY = "order.cancelled";

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(ORDER_EXCHANGE);
    }

    @Bean
    public Queue orderCreatedQueue() {
        return QueueBuilder.durable(ORDER_CREATED_QUEUE).build();
    }

    @Bean
    public Queue orderCancelledQueue() {
        return QueueBuilder.durable(ORDER_CANCELLED_QUEUE).build();
    }

    @Bean
    public Binding orderCreatedBinding() {
        return BindingBuilder.bind(orderCreatedQueue())
                .to(orderExchange())
                .with(ORDER_CREATED_KEY);
    }

    @Bean
    public Binding orderCancelledBinding() {
        return BindingBuilder.bind(orderCancelledQueue())
                .to(orderExchange())
                .with(ORDER_CANCELLED_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
