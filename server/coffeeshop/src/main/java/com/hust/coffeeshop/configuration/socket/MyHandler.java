package com.hust.coffeeshop.configuration.socket;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class MyHandler extends TextWebSocketHandler {
    @Getter
    List<WebSocketSession> list = new ArrayList<>();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException, InterruptedException {
        log.info("Test message {}", message.toString());
        list.add(session);
        session.sendMessage( new TextMessage("Hello world"));
        Thread.sleep(1000);
    }
}
