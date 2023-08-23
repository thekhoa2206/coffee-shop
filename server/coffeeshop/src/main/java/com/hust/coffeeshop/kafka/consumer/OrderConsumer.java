package com.hust.coffeeshop.kafka.consumer;

import lombok.extern.apachecommons.CommonsLog;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.nio.charset.StandardCharsets;

@CommonsLog
@Component
public class OrderConsumer {

    @KafkaListener(
            groupId = "",
            topics = "order",
            concurrency = ""
    )
    public void process(ConsumerRecord<String, String> record) throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        System.out.println(record);
    }
}
