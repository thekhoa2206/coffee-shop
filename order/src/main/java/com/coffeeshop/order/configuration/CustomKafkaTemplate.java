//package com.coffeeshop.order.configuration;
//
//import org.apache.kafka.clients.producer.ProducerConfig;
//import org.apache.kafka.common.serialization.StringSerializer;
//import org.springframework.kafka.core.DefaultKafkaProducerFactory;
//import org.springframework.kafka.core.KafkaTemplate;
//
//import java.util.HashMap;
//
//public class CustomKafkaTemplate {
//    private final KafkaTemplate<String, String> kafkaTemplate;
//
//    public CustomKafkaTemplate() {
//        var kafkaProps = new HashMap<String, Object>();
//        kafkaProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//        kafkaProps.put(ProducerConfig.RETRIES_CONFIG, 0);
//        kafkaProps.put(ProducerConfig.BATCH_SIZE_CONFIG, 2097152);
//        kafkaProps.put(ProducerConfig.LINGER_MS_CONFIG, 5);
//        kafkaProps.put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, 2097152);
//        kafkaProps.put(ProducerConfig.ACKS_CONFIG, "all");
//        kafkaProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
//        kafkaProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
//        var producerFactory = new DefaultKafkaProducerFactory<String, String>(kafkaProps);
//        this.kafkaTemplate = new KafkaTemplate<>(producerFactory);
//    }
//
//    public void send(String topic, String key, String value) {
//        kafkaTemplate.send(topic, key, value);
//    }
//}
