//package com.coffeeshop.order.configuration;
//
//import org.apache.kafka.clients.admin.NewTopic;
//import org.apache.kafka.clients.producer.ProducerConfig;
//import org.apache.kafka.common.serialization.StringSerializer;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.kafka.core.DefaultKafkaProducerFactory;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.kafka.core.ProducerFactory;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Configuration
//@ConditionalOnClass(CustomKafkaTemplate.class)
//public class KafkaProducerConfig {
//    @Bean
//    NewTopic order(){
//        return new NewTopic("order", 2, (short) 1);
//    }
//    @Bean
//    @ConditionalOnMissingBean
//    @ConditionalOnProperty("spring.kafka.bootstrap-servers")
//    public CustomKafkaTemplate customKafkaTemplate(@Value("${spring.kafka.bootstrap-servers}") String bootstrapUrl) {
//        return new CustomKafkaTemplate();
//    }
//}
