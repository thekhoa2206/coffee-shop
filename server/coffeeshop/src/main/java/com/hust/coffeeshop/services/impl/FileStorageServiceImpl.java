package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.models.dto.FileResponse;
import com.hust.coffeeshop.models.entity.File;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.FileRepository;
import com.hust.coffeeshop.services.FileStorageService;
import lombok.val;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

@Service
public class FileStorageServiceImpl implements FileStorageService {
private final FileRepository fileRepository;
    @Value("${file.upload-dir}")
    private String sourceFile;

    public FileStorageServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }
    @Override
    public FileResponse uploadFile(MultipartFile file, String description) throws IOException {
        // lấy tên file
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        // Check nếu tên file trống báo lỗi
        if (fileName.contains("..")) {
            throw new ErrorException("Tên file chứa path không hợp lệ" + fileName);
        }
        File fileNew = new File();
        fileNew.setName(fileName);
        fileNew.setSize(file.getSize());
        fileNew.setType(file.getContentType());
        //Chuyển file cần lưu vào folder lưu trữ
        file.transferTo(new java.io.File(
                sourceFile + file.getOriginalFilename()));
         val dbFile = fileRepository.save(fileNew);
        String fileUrL = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/file/view"+dbFile.getId())
                .toUriString();
        FileResponse fileResponse = new FileResponse();
        fileResponse.setFileUrl(fileUrL);
        fileResponse.setId(dbFile.getId());
        fileResponse.setFileName(fileName);
        return fileResponse;
    }
    @Override
    public ResponseEntity<Resource> downloadFile(int id) throws MalformedURLException {
        val dbFile = fileRepository.findById(id);
        byte[] bytes = ByteBuffer.allocate(8).putLong(dbFile.get().getSize()).array();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(dbFile.get().getType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dbFile.get().getName() + "\"");

    }

}
