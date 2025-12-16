import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./card2.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function Card2({ rooms }) {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [rooms]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VNĐ";
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(rooms.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentRooms = rooms.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={styles.container}>
      <div className={styles.roomsGrid}>
        {currentRooms.map((room) => (
          <div
            key={room.id}
            className={styles.roomCard}
            onClick={() => navigate(`/room/${room.id}`)}
          >
            <div className={styles.roomImageWrapper}>
              <img
                src={room.primaryImageUrl}
                alt={room.name}
                className={styles.roomImage}
              />
            </div>
            <div className={styles.roomInfo}>
              <h3>{room.name}</h3>
              <p className={styles.roomClass}>{room.roomClass}</p>
              <p className={styles.roomAmenities}>{room.description}</p>
              <div className={styles.roomFooter}>
                {/* <div className={styles.review}>
                  <span className={styles.stars}>
                    {renderStars(room.review)}
                  </span>
                  <span className={styles.ratingValue}>
                    {room.review} ({room.reviewCount} reviews)
                  </span>
                </div> */}
              </div>
              <div className={styles.roomPrice}>
                {formatPrice(room.price)}/đêm
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={`${styles.paginationButton} ${styles.prevButton}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <IoChevronBack />
            <span>Trước</span>
          </button>

          <div className={styles.pageNumbers}>
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  className={`${styles.pageNumber} ${
                    currentPage === page ? styles.active : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            className={`${styles.paginationButton} ${styles.nextButton}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <span>Sau</span>
            <IoChevronForward />
          </button>
        </div>
      )}
    </div>
  );
}

export default Card2;
