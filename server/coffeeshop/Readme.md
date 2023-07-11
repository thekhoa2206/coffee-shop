- Ngôn ngữ Java - Framework Spring boot
- Ý nghĩa từng phần:
  - Controller: để khai báo các Api
  - Service: để xử lí logic khi client gọi Api 
  - Repository: Tương tác với cơ sở dữ liệu sau khi xử lý logic ở services
  - Models:
    + Dto: Các object request và response ...
    + Entity: Các object map với cơ sở dữ liệu
  - Configuration: chứa các cấu hình của ứng dụng như: bảo mật, tool mapper, cấu hình web, cấu hình Jpa spring boot,...
  - Common: Chứa các hàm, biến sử dụng chung nhằm tái sử dụng ví dụ: các status, hàm, mẫu in, ... 
  - Job: dùng để chạy các job theo thời gian cài đặt mặc định