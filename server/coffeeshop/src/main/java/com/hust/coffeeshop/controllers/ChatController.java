package com.hust.coffeeshop.controllers;

import com.hust.coffeeshop.models.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class ChatController {
    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public ChatMessage greeting(@Payload ChatMessage chatMessage) throws Exception {
        return chatMessage;
    }
}
