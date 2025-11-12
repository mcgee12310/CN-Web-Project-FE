import React, { useState } from "react";
import styles from "./ImageGallery.module.css";
import { IoChevronBack, IoChevronForward, IoCloseSharp } from "react-icons/io5";
import { IoCamera } from "react-icons/io5";

function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

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

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryContainer}>
        <div className={styles.mainImageContainer}>
          <div
            className={styles.mainImage}
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
            onClick={handleMainImageClick}
          >
            <div className={styles.imageOverlay}>
              <IoChevronBack
                className={styles.prevButton}
                onClick={handlePrev}
              />
              <IoChevronForward
                className={styles.nextButton}
                onClick={handleNext}
              />
            </div>
          </div>
        </div>

        <div className={styles.thumbnailContainer}>
          {displayImages.slice(1, 4).map((image, index) => {
            const actualIndex = index + 1;
            const isLast = index === 2;
            return (
              <div
                key={actualIndex}
                className={`${styles.thumbnail} ${
                  actualIndex === currentIndex ? styles.active : ""
                }`}
                onClick={() => handleThumbnailClick(actualIndex)}
                style={{ backgroundImage: `url(${image})` }}
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

      {selectedImage !== null && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <IoCloseSharp className={styles.closeButton} onClick={closeModal} />
            <img
              src={images[selectedImage]}
              alt={`Room image ${selectedImage + 1}`}
              className={styles.modalImage}
            />
            <IoChevronBack
              className={styles.modalPrev}
              onClick={() =>
                setSelectedImage(
                  (selectedImage - 1 + images.length) % images.length
                )
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
