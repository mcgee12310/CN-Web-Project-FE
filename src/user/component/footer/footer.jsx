import styles from "./footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>Hikari Hotel</div>
        <div className={styles.links}>
          <a href="#about">Về chúng tôi</a>
          <a href="#rooms">Phòng</a>
          <a href="#contact">Liên hệ</a>
        </div>
        <div className={styles.copy}>
          © {new Date().getFullYear()} Hikari. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
