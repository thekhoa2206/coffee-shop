package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.FileResponse;
import org.springframework.http.ResponseEntity;
<<<<<<< .mine

=======

>>>>>>> .theirs
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    FileResponse uploadFile(MultipartFile[] files ) throws IOException;
    ResponseEntity<byte[]> getImage (int id) throws IOException;
}
