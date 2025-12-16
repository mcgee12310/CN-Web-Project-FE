import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, InputNumber, Switch, Menu, Tag, message, Dropdown, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import styles from './TierManagement.module.css';
import { toast } from 'react-toastify';
import tierService from '../../../services/admin/tier';

const { TextArea } = Input;

function TierManagement() {
  const [tiers, setTiers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tierToDelete, setTierToDelete] = useState(null);
  const [editingTier, setEditingTier] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    minSpending: '',
    minBookings: '',
    discountPercent: '',
    description: '',
    active: true
  });

  // Load dữ liệu
  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const response = await tierService.getAllTiers();
      // Giả sử API trả về data trong response.data
      setTiers(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể tải danh sách hạng!');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tier = null) => {
    if (tier) {
      setEditingTier(tier);
      setFormData({
        code: tier.code,
        name: tier.name,
        minSpending: tier.minSpending,
        minBookings: tier.minBookings,
        discountPercent: tier.discountPercent,
        description: tier.description,
        active: tier.active
      });
    } else {
      setEditingTier(null);
      setFormData({
        code: '',
        name: '',
        minSpending: '',
        minBookings: '',
        discountPercent: '',
        description: '',
        active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTier(null);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.code || !formData.name || !formData.description) {
      message.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const payload = {
      code: formData.code.toUpperCase(),
      name: formData.name,
      minSpending: Number(formData.minSpending),
      minBookings: Number(formData.minBookings),
      discountPercent: Number(formData.discountPercent),
      description: formData.description,
      active: formData.active
    };

    try {
      if (editingTier) {
        await tierService.updateTier(editingTier.id, payload);
        toast.success('Cập nhật hạng thành công!');
      } else {
        await tierService.createTier(payload);
        toast.success('Tạo hạng mới thành công!');
      }

      closeModal();
      fetchTiers();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi lưu hạng!');
    }
  };

  const handleDeleteClick = (tier) => {
    setTierToDelete(tier);
    setShowDeleteModal(true);
  };

  // Hàm thực hiện xóa khi confirm modal
  const confirmDelete = async () => {
    if (!tierToDelete) return;

    try {
      // TODO: Gọi API xóa hạng
      // await tierService.deleteTier(tierToDelete.id);
      console.log("Deleted tier:", tierToDelete.id);

      setTiers(prev => prev.filter(t => t.id !== tierToDelete.id));
      message.success("Xóa hạng thành công!");
    } catch (error) {
      console.error(error);
      message.error("Xóa hạng thất bại!");
    } finally {
      setShowDeleteModal(false);
      setTierToDelete(null);
    }
  };

  // Đóng modal
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTierToDelete(null);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };

  // Định nghĩa columns cho Table
  const columns = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      render: (code) => <Tag color="blue" className={styles.codeTag}>{code}</Tag>
    },
    {
      title: 'Tên hạng',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (name) => <strong>{name}</strong>
    },
    {
      title: 'Chi tiêu tối thiểu',
      dataIndex: 'minSpending',
      key: 'minSpending',
      width: '15%',
      render: (amount) => formatMoney(amount)
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minBookings',
      key: 'minBookings',
      width: '10%',
      render: (count) => `${count} đơn`
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
      width: '10%',
      render: (percent) => <Tag color="green" style={{ fontWeight: 'bold' }}>{percent}%</Tag>
    },
    {
      title: 'Số thành viên',
      dataIndex: 'userCount',
      key: 'userCount',
      width: '10%',
      render: (count) => `${count} người`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: '10%',
      render: (active) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? 'Hoạt động' : 'Tắt'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openModal(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteClick(record)}
          >
            Xóa
          </Button>

        </Space>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản lý Hạng Thành Viên</h1>
          <p className={styles.subtitle}>Quản lý các hạng và ưu đãi cho khách hàng</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => openModal()}
        >
          Thêm hạng mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tiers}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} hạng`
        }}
        scroll={{ }}
      />

      {/* Modal */}
      <Modal
        title={editingTier ? 'Chỉnh sửa hạng' : 'Thêm hạng mới'}
        open={showModal}
        onOk={handleSave}
        onCancel={closeModal}
        width={700}
        okText={editingTier ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
      >
        <div className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Mã hạng *</label>
              <Input
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="VD: PLATINUM"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tên hạng *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="VD: Bạch Kim"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Chi tiêu tối thiểu (VNĐ) *</label>
              <InputNumber
                value={formData.minSpending}
                onChange={(value) => handleChange('minSpending', value)}
                placeholder="200000000"
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Số đơn tối thiểu *</label>
              <InputNumber
                value={formData.minBookings}
                onChange={(value) => handleChange('minBookings', value)}
                placeholder="80"
                style={{ width: '100%' }}
                min={0}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Phần trăm giảm giá (%) *</label>
            <InputNumber
              value={formData.discountPercent}
              onChange={(value) => handleChange('discountPercent', value)}
              placeholder="20"
              style={{ width: '100%' }}
              min={0}
              max={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả *</label>
            <TextArea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả về hạng thành viên..."
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <label style={{ marginRight: 12 }}>Kích hoạt hạng này</label>
            <Switch
              checked={formData.active}
              onChange={(checked) => handleChange('active', checked)}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={showDeleteModal}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa hạng "{tierToDelete?.name}" không?</p>
      </Modal>
    </div>
  );
}

export default TierManagement;
