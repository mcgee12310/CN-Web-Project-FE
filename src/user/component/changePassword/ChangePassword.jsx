import React, { useState } from "react";
import { Input, Button, Form } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

import styles from "./ChangePassword.module.css";
import profileService from "../../../services/user/profile";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;

    setLoading(true);
    try {
      await profileService.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      toast.success("Đổi mật khẩu thành công!");
      form.resetFields();
    } catch (error) {
      console.error("Change password failed:", error);

      toast.error(
        typeof error?.response?.data?.error === "string"
          ? error.response.data.error
          : Object.values(error?.response?.data?.error || {})[0] ||
              "Đổi mật khẩu thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Thay đổi mật khẩu</h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleChangePassword}
        className={styles.form}
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[{ required: true, message: "Nhập mật khẩu hiện tại" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu hiện tại"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Nhập lại mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu mới"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submitButton}
            block
          >
            Lưu mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
