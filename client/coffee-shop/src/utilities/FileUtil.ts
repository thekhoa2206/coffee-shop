export const getBase64 = (file: File) => {
  return new Promise((resolve: (value: string) => void) => {
    let baseURL: string;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      baseURL = reader.result?.toString() || "";
      resolve(baseURL.split(",")[1]);
    };
  });
};

export interface FileUploadRequest {
  id: number;
  objectId?: number;
  base64?: string;
  src?: string;
  file_name?: string;
  size?: number;
  alt?: string;
  bytes?: ArrayBuffer;
  imageId?: number;
  isLoading?: boolean;
  fileType?: string;
  type?: string;
}

export const ImageLimitSize = 2 * 1024 * 1024; //2MB
export const ValidImageTypes = ["image/gif", "image/jpeg", "image/jpg", "image/png", "image/bmp"];
