import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button, Space } from "antd";

const ProductModal = ({ open, editingProduct, onSave, onCancel, isLoading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        form.setFieldsValue({
          title: editingProduct.title,
          price: editingProduct.price,
          rating: editingProduct.rating || 5,
          thumbnail:
            editingProduct.thumbnail || editingProduct.images?.[0] || "",
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingProduct, form]);

  const handleFinish = (values) => {
    onSave(values);
  };

  return (
    <Modal
      title={editingProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ rating: 5 }}
      >
        <Form.Item
          label="Tên Sản Phẩm"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Giá (VND)"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
        >
          <InputNumber
            placeholder="Nhập giá"
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>

        <Form.Item label="Đánh Giá (1-5)" name="rating">
          <InputNumber min={1} max={5} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Ảnh URL" name="thumbnail">
          <Input placeholder="Nhập URL ảnh" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={onCancel} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {editingProduct ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
