import Header from "../../component/header/header";
import { useAuth } from "../../../auth/auth-context";
import styles from "./home.module.css";
import Card1 from "../../component/roomCard/card1/card1";
function HomeUser() {
  return <h1>Home</h1>;
}
function HomeGuest() {
  const handleBookNow = () => {
    // sau này bạn có thể navigate("/rooms") hoặc mở modal đăng nhập
    console.log("Đi đến trang đặt phòng");
  };
  return (
    <main className={styles.homeGuest}>
      {/* Banner */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <h1 className={styles.bannerTitle}>
              Chào mừng đến với Khách sạn Hikari
            </h1>
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
            Khách sạn Hikari là điểm đến lý tưởng cho những ai tìm kiếm sự thoải
            mái và tiện nghi. Với vị trí đắc địa tại trung tâm thành phố, chúng
            tôi mang đến cho quý khách trải nghiệm nghỉ dưỡng tuyệt vời cùng
            dịch vụ chuyên nghiệp và không gian sang trọng.
          </p>
        </div>
      </section>

      {/* Phòng nổi bật */}
      <section className={styles.featuredRooms}>
        <Card1 />
      </section>
    </main>
  );
}
function Home() {
  const { user } = useAuth();
  return (
    <>
      <Header></Header>
      {!user ? <HomeGuest></HomeGuest> : <HomeUser></HomeUser>}
    </>
  );
}
export default Home;
