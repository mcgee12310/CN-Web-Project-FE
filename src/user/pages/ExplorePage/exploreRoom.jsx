import React from "react";
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import Card2 from "../../component/roomCard/card2/card2";
import FilterSidebar from "../../component/filterSidebar/filterSidebar";
import styles from "./exploreRoom.module.css";

function ExploreRoom() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <aside className={styles.sidebarContainer}>
            <FilterSidebar />
          </aside>
          <section className={styles.roomsContainer}>
            <Card2 />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default ExploreRoom;
