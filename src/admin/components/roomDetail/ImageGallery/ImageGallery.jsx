import React, { useState, useEffect } from "react";
import styles from "./ImageGallery.module.css";
import { IoChevronBack, IoChevronForward, IoCloseSharp, IoCamera } from "react-icons/io5";

function ImageGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // reset index khi images thay đổi
  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
      setSelectedImage(null);
    } else if (currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images]);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handleMainImageClick = () => {
    setSelectedImage(currentIndex);
  };

  const handleShowAllClick = () => {
    setSelectedImage(0);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const displayImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  if (!images || images.length === 0) return <p>Chưa có ảnh.</p>;

  // Helper function để lấy imageUrl từ image object hoặc string
  const getImageUrl = (img) => typeof img === "string" ? img : img?.imageUrl || "";

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryContainer}>
        {/* ẢNH CHÍNH */}
        <div className={styles.mainImageContainer}>
          <div
            className={styles.mainImage}
            style={{
              backgroundImage: `url(${getImageUrl(images[currentIndex])})`,
            }}
            onClick={handleMainImageClick}
          >
            <div className={styles.imageOverlay}>
              <IoChevronBack className={styles.prevButton} onClick={handlePrev} />
              <IoChevronForward className={styles.nextButton} onClick={handleNext} />
            </div>
          </div>
        </div>

        {/* ẢNH THUMBNAIL */}
        <div className={styles.thumbnailContainer}>
          {displayImages.slice(1, 4).map((img, index) => {
            const actualIndex = index + 1;
            const isLast = index === 2;

            return (
              <div
                key={img.id || idx}
                className={`${styles.thumbnail} ${
                  actualIndex === currentIndex ? styles.active : ""
                }`}
                onClick={() => handleThumbnailClick(actualIndex)}
                style={{
                  backgroundImage: `url(${getImageUrl(img)})`,
                }}
              >
                {isLast && remainingCount > 0 && (
                  <div
                    className={styles.showAllOverlay}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowAllClick();
                    }}
                  >
                    <IoCamera className={styles.cameraIcon} />
                    <span>Show all photos</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {selectedImage !== null && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <IoCloseSharp className={styles.closeButton} onClick={closeModal} />
            <img
              src={getImageUrl(images[selectedImage])}
              alt={`Room image ${selectedImage + 1}`}
              className={styles.modalImage}
            />

            <IoChevronBack
              className={styles.modalPrev}
              onClick={() =>
                setSelectedImage((selectedImage - 1 + images.length) % images.length)
              }
            />
            <IoChevronForward
              className={styles.modalNext}
              onClick={() =>
                setSelectedImage((selectedImage + 1) % images.length)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
