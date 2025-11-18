import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./card2.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function Card2() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;
  const navigate = useNavigate();

  const rooms = [
    {
      id: 1,
      name: "Superior Family Room",
      details: "6 guests • 4 beds • 1 private bath",
      amenities: "Kitchen • Wifi • Air conditioning",
      price: "2,500,000 VNĐ/đêm",
      image: "/background.jpg",
      review: 4.84,
      reviewCount: 324,
    },
    {
      id: 2,
      name: "Rainbow Plantation",
      details: "3 guests • 1 bedroom • 1 bath",
      amenities: "Kitchen • Wifi • Air conditioning",
      price: "2,500,000 VNĐ/đêm",
      image: "/background1.jpg",
      review: 4.77,
      reviewCount: 636,
    },
    {
      id: 3,
      name: "Rainbow Plantation",
      details: "3 guests • 1 bedroom • 1 bath",
      amenities: "Kitchen • Wifi • Air conditioning",
      price: "2,500,000 VNĐ/đêm",
      image: "/background1.jpg",
      review: 4.77,
      reviewCount: 636,
    },
    {
      id: 4,
      name: "Rainbow Plantation",
      details: "3 guests • 1 bedroom • 1 bath",
      amenities: "Kitchen • Wifi • Air conditioning",
      price: "2,500,000 VNĐ/đêm",
      image: "/background1.jpg",
      review: 4.77,
      reviewCount: 636,
    },
    {
      id: 5,
      name: "Rainbow Plantation",
      details: "3 guests • 1 bedroom • 1 bath",
      amenities: "Kitchen • Wifi • Air conditioning",
      price: "2,500,000 VNĐ/đêm",
      image: "/background1.jpg",
      review: 4.77,
      reviewCount: 636,
    },
    {
      id: 6,
      name: "Rainbow Plantation",
      details: "3 guests • 1 bedroom • 1 bath",
      amenities: "Kitchen • Wifi • Air conditioning",
      price: "2,500,000 VNĐ/đêm",
      image: "/background1.jpg",
      review: 4.77,
      reviewCount: 636,
    },
  ];

  // Hàm tạo icon sao theo số review
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className={styles.star} />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
      else stars.push(<FaRegStar key={i} className={styles.star} />);
    }
    return stars;
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

  // Tạo mảng số trang để hiển thị
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
                src={room.image}
                alt={room.name}
                className={styles.roomImage}
              />
            </div>
            <div className={styles.roomInfo}>
              <h3>{room.name}</h3>
              <p className={styles.roomDetails}>{room.details}</p>
              <p className={styles.roomAmenities}>{room.amenities}</p>
              <div className={styles.roomFooter}>
                <div className={styles.review}>
                  <span className={styles.stars}>
                    {renderStars(room.review)}
                  </span>
                  <span className={styles.ratingValue}>
                    {room.review} ({room.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className={styles.roomPrice}>{room.price}</div>
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
