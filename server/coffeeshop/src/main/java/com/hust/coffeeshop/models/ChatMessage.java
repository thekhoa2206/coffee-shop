package com.hust.coffeeshop.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    private String message;
    private String username;
    private String receiverName;
    private boolean connected;
}