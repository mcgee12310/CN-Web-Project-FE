import React from "react";
import styles from "./Loading.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loadingDot from "../../../assets/loading.lottie";

export default function Loading({ overlay = true }) {
  const content = (
    <div className={styles.container}>
      <DotLottieReact
        src={loadingDot}
        autoplay
        loop
        className={styles.lottie}
      />
    </div>
  );

  if (!overlay) return content;

  return <div className={styles.overlay}>{content}</div>;
}
