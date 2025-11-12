import React, { useState } from "react";
import { Input, Button, Form } from "antd";
import { LockOutlined } from "@ant-design/icons";
import styles from "./ChangePassword.module.css";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const handleChangePassword = (values) => {
    setLoading(true);
    console.log("Password changed:", values);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className={styles.header}>
        <h2>Thay đổi mật khẩu</h2>
      </div>

      <Form
        layout="vertical"
        onFinish={handleChangePassword}
        className={styles.form}
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Please enter your new password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your new password"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your password"
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
            Change password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
