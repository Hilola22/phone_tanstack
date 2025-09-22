import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Checkbox, Button } from "antd";
import { usePhone, type IPhone } from "../api/hooks/usePhone";

interface Props {
  editingItem: IPhone | null;
  setEditingItem: (item: IPhone | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const ModalWindow: React.FC<Props> = ({
  editingItem,
  setEditingItem,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [form] = Form.useForm();
  const { createPhone, updatePhone } = usePhone();
  const { mutate: createMutate, isPending: isCreating } = createPhone();
  const { mutate: updateMutate, isPending: isUpdating } = updatePhone();

  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue({
        title: editingItem.title,
        price: editingItem.price,
        memories: editingItem.memories.join(", "),
        hasDelivery: editingItem.hasDelivery,
        imageUrl: editingItem.imageUrl || "",
      });
    } else {
      form.resetFields();
    }
  }, [editingItem, form]);

  const handleSubmit = (values: any) => {
    const data = {
      ...values,
      price: Number(values.price),
      memories: values.memories.split(",").map((m: string) => m.trim()),
      id: editingItem?.id || "",
    };

    if (editingItem) {
      updateMutate(data, {
        onSuccess: () => closeModal(),
      });
    } else {
      createMutate(data, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const closeModal = () => {
    form.resetFields();
    setEditingItem(null);
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={editingItem ? "Edit Phone" : "Add Phone"}
      open={isModalOpen}
      onCancel={closeModal}
      footer={null} 
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Title..." />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter a price" }]}
        >
          <InputNumber
            placeholder="Price..."
            className="w-full"
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[{ required: true, message: "Please enter image URL" }]}
        >
          <Input placeholder="Image URL..." />
        </Form.Item>

        <Form.Item
          name="memories"
          label="Memories"
          rules={[{ required: true, message: "Please enter memories" }]}
        >
          <Input placeholder="Comma separated memories..." />
        </Form.Item>

        <Form.Item name="hasDelivery" valuePropName="checked">
          <Checkbox>Has Delivery</Checkbox>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={closeModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
            >
              {editingItem ? "Save" : "Submit"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(ModalWindow);
