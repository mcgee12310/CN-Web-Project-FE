import React, { useState, useEffect } from "react";
import styles from "./memberInfoModal.module.css";

// react-icons
import { IoClose } from "react-icons/io5";
import { FaStar, FaCrown, FaAward, FaGem } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";

import profileService from "../../../services/user/profile";

const MemberInfoModal = ({
  isOpen,
  onClose,
  userName = "",
  currentTier = "BRONZE",
}) => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch tier info when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchTiers = async () => {
      try {
        setLoading(true);
        const data = await profileService.getTierInfo();
        setTiers(data || []);

        const current = data?.find((t) => t.code === currentTier);
        setSelectedTier(current || data?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch tier info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentTier]);

  if (!isOpen) return null;

  const getTierIcon = (code) => {
    switch (code) {
      case "BRONZE":
        return <FaAward size={20} />;
      case "SILVER":
        return <FaStar size={20} />;
      case "GOLD":
        return <FaCrown size={20} />;
      case "DIAMOND":
        return <FaGem size={20} />;
      case "PLATINUM":
        return <BsLightningFill size={20} />;
      default:
        return <FaAward size={20} />;
    }
  };

  const getTierClass = (code) => styles[code?.toLowerCase()] || styles.bronze;

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const currentTierData = tiers.find((t) => t.code === currentTier);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          className={`${styles.modalHeader} ${getTierClass(
            selectedTier?.code
          )}`}
        >
          <button onClick={onClose} className={styles.closeBtn}>
            <IoClose size={24} />
          </button>

          <div className={styles.headerInfo}>
            <div className={styles.userAvatar}>
              {userName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className={styles.userName}>{userName}</h2>
              <div className={styles.currentTier}>
                {currentTierData && getTierIcon(currentTierData.code)}
                <span>Hạng hiện tại: {currentTierData?.code || "Đồng"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tiers.map((tier) => {
            const isActive = selectedTier?.code === tier.code;
            const isCurrent = tier.code === currentTier;

            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className={`${styles.tab} ${
                  isActive ? styles.tabActive : ""
                } ${getTierClass(tier.code)}`}
              >
                <div className={styles.tabContent}>
                  {getTierIcon(tier.code)}
                  <span>{tier.code}</span>
                </div>
                {isCurrent && <span className={styles.currentDot} />}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {loading && <p className={styles.loading}>Đang tải dữ liệu...</p>}

          {!loading && selectedTier && (
            <div className={styles.tierDetails}>
              {/* Tier Header */}
              <div
                className={`${styles.tierHeader} ${getTierClass(
                  selectedTier.code
                )}`}
              >
                <div className={styles.tierHeaderTop}>
                  <div className={styles.tierIcon}>
                    {getTierIcon(selectedTier.code)}
                  </div>
                  <div>
                    <h3 className={styles.tierName}>{selectedTier.code}</h3>
                    <p className={styles.tierDesc}>
                      {selectedTier.description}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className={styles.tierStats}>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>
                      {selectedTier.discountPercent}%
                    </div>
                    <div className={styles.statLabel}>Giảm giá</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>
                      {selectedTier.minBookings}
                    </div>
                    <div className={styles.statLabel}>Đơn tối thiểu</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>
                      {selectedTier.userCount}
                    </div>
                    <div className={styles.statLabel}>Thành viên</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>
                      #{selectedTier.tierOrder}
                    </div>
                    <div className={styles.statLabel}>Thứ hạng</div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>
                  <FaAward size={18} /> Điều kiện đạt hạng
                </h4>
                <div className={styles.requirements}>
                  <div className={styles.requirement}>
                    <span>Chi tiêu tối thiểu</span>
                    <strong>{formatCurrency(selectedTier.minSpending)}</strong>
                  </div>
                  <div className={styles.requirement}>
                    <span>Số đơn đặt tối thiểu</span>
                    <strong>{selectedTier.minBookings} đơn</strong>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>
                  <FaStar size={18} /> Quyền lợi thành viên
                </h4>
                <ul className={styles.benefits}>
                  <li>✓ Giảm giá {selectedTier.discountPercent}%</li>
                  <li>✓ Ưu tiên nhận phòng sớm và trả phòng muộn</li>
                </ul>
              </div>

              {/* CTA */}
              {selectedTier.code !== currentTier &&
                selectedTier.tierOrder > (currentTierData?.tierOrder || 0) && (
                  <div
                    className={`${styles.cta} ${getTierClass(
                      selectedTier.code
                    )}`}
                  >
                    <h4>Nâng cấp lên hạng {selectedTier.name}</h4>
                    <p>
                      Còn thiếu{" "}
                      {formatCurrency(
                        selectedTier.minSpending -
                          (currentTierData?.minSpending || 0)
                      )}
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberInfoModal;
