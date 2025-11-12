import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import { useAuth } from "../../../auth/auth-context";
import styles from "./home.module.css";
import Card1 from "../../component/roomCard/card1/card1";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaBed,
  FaConciergeBell,
  FaUtensils,
} from "react-icons/fa";

function Highlights() {
  const highlights = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Vị trí trung tâm",
      text: "Chỉ cách các điểm du lịch và trung tâm mua sắm vài phút đi bộ.",
    },
    {
      icon: <FaBed />,
      title: "Phòng nghỉ sang trọng",
      text: "Thiết kế tinh tế, tiện nghi hiện đại mang lại cảm giác thoải mái.",
    },
    {
      icon: <FaConciergeBell />,
      title: "Dịch vụ 5 sao",
      text: "Đội ngũ nhân viên chuyên nghiệp, tận tâm phục vụ 24/7.",
    },
    {
      icon: <FaUtensils />,
      title: "Ẩm thực đa dạng",
      text: "Thưởng thức món ăn Á – Âu và đặc sản địa phương độc đáo.",
    },
  ];
  return (
    <section className={styles.highlightsSection}>
      <div className={styles.container}>
        <h2>Điểm nổi bật của chúng tôi</h2>
        <div className={styles.highlightsGrid}>
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              className={styles.highlightItem}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className={styles.icon}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleBookNow = () => {
    if (!user) {
      console.log("Đi đến trang đặt phòng");
      navigate("/login");
    }
  };
  return (
    <>
      <Header></Header>
      <main className={styles.homeGuest}>
        {/* Banner */}
        <section className={styles.bannerSection}>
          {/* các layer ảnh */}
          <span
            className={styles.bgSlide}
            style={{ "--bg": "url('/background.jpg')", "--i": 1 }}
          ></span>
          <span
            className={styles.bgSlide}
            style={{ "--bg": "url('/background1.jpg')", "--i": 2 }}
          ></span>
          <span
            className={styles.bgSlide}
            style={{ "--bg": "url('/background2.jpg')", "--i": 3 }}
          ></span>

          {/* overlay + nội dung cũ */}
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerContent}>
              <h1 className={styles.bannerTitle}>Chào mừng đến với Hikari</h1>
              <p className={styles.bannerSubtitle}>
                Trải nghiệm nghỉ dưỡng tuyệt vời tại trung tâm thành phố
              </p>
              <button className={styles.bannerCta} onClick={handleBookNow}>
                Đặt phòng ngay
              </button>
            </div>
          </div>
        </section>

        {/* Mô tả khách sạn */}
        <section className={styles.hotelDescription}>
          <div className={styles.container}>
            <h2>Về chúng tôi</h2>
            <p>
              Khách sạn Hikari là điểm đến lý tưởng cho những ai tìm kiếm sự
              thoải mái và tiện nghi. Với vị trí đắc địa tại trung tâm thành
              phố, chúng tôi mang đến cho quý khách trải nghiệm nghỉ dưỡng tuyệt
              vời cùng dịch vụ chuyên nghiệp và không gian sang trọng.
            </p>
          </div>
        </section>

        {/* Điểm nổi bật */}
        <Highlights></Highlights>

        {/* Phòng nổi bật */}
        <section className={styles.featuredRooms}>
          <Card1 />
        </section>
      </main>
      <Footer />
    </>
  );
}
export default Home;
