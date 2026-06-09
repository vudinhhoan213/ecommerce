import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import type { Product } from "../../../types";

interface ProductModalProps {
  open: boolean;
  editingProduct: Product | null;
  onSave: (values: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({ open, editingProduct, onSave, onCancel, isLoading }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        form.setFieldsValue({
          title: editingProduct.title,
          price: editingProduct.price,
          rating: editingProduct.rating || 5,
          thumbnail: editingProduct.thumbnail || editingProduct.images?.[0] || "",
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingProduct, form]);

  return (
    <Modal
      title={editingProduct ? t("productModal.editTitle") : t("productModal.addTitle")}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSave} initialValues={{ rating: 5 }}>
        <Form.Item
          label={t("productModal.nameLabel")}
          name="title"
          rules={[{ required: true, message: t("productModal.nameRequired") }]}
        >
          <Input placeholder={t("productModal.namePlaceholder")} />
        </Form.Item>

        <Form.Item
          label={t("productModal.priceLabel")}
          name="price"
          rules={[{ required: true, message: t("productModal.priceRequired") }]}
        >
          <InputNumber placeholder={t("productModal.pricePlaceholder")} style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label={t("productModal.ratingLabel")} name="rating">
          <InputNumber min={1} max={5} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label={t("productModal.imageLabel")} name="thumbnail">
          <Input placeholder={t("productModal.imagePlaceholder")} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={onCancel} disabled={isLoading}>{t("common.cancel")}</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {editingProduct ? t("productModal.updateButton") : t("productModal.addButton")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
