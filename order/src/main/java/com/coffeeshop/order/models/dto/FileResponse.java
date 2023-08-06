package com.coffeeshop.order.models.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileResponse {
    private int id;
    private String fileName;
    private String fileUrl;
    private String path;
    private long size;
}
