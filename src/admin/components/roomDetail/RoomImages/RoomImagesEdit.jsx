import React, { useState, useEffect } from "react";
import styles from "./RoomImagesEdit.module.css";
import { IoCloudUpload } from "react-icons/io5";
import { toast } from "react-toastify";
import roomTypeService from "../../../../services/admin/roomType";

function RoomImagesEdit({ roomTypeId, images = [], onChange = () => {} }) {
  const [currentImages, setCurrentImages] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Khi props images thay đổi -> set lại state
  useEffect(() => {
    setCurrentImages(images.map((img) => (typeof img === "string" ? img : img.imageUrl)));
    setIsDirty(false);
  }, [images]);

  const handleUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    if (!newFiles.length) return;

    setFiles(newFiles);

    // Tạo preview tạm thời
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setCurrentImages(previews);
    setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      toast.warning("Vui lòng chọn ít nhất 1 ảnh!");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setIsLoading(true);
      const res = await roomTypeService.uploadRoomTypeImage(roomTypeId, formData);

      // API trả về mảng ảnh mới - giữ nguyên định dạng object để ImageGallery xử lý
      const updatedImages = res.data || [];
      setCurrentImages(updatedImages.map((img) => typeof img === "string" ? img : img.imageUrl));
      onChange(updatedImages);
      setFiles([]);
      setIsDirty(false);

      toast.success("Cập nhật ảnh thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật ảnh thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentImages(images.map((img) => (typeof img === "string" ? img : img.imageUrl)));
    setFiles([]);
    setIsDirty(false);
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Ảnh phòng</h3>

      <div className={styles.imagesGrid}>
        {currentImages.map((img, idx) => (
          <div key={idx} className={styles.imageBox}>
            <img src={img} alt={`room-${idx}`} className={styles.image} />
          </div>
        ))}

        <label className={styles.uploadBox}>
          <IoCloudUpload className={styles.uploadIcon} />
          <span>{isLoading ? "Đang tải..." : "Cập nhật"}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            hidden
            disabled={isLoading}
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.saveBtn}
          disabled={!isDirty || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Đang lưu..." : "Lưu"}
        </button>
        <button
          className={styles.cancelBtn}
          onClick={handleCancel}
          disabled={isLoading}
        >
          Hủy
        </button>
      </div>
    </section>
  );
}

export default RoomImagesEdit;
