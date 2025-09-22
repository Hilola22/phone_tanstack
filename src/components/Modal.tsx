import React, { useState, type FormEvent, useEffect } from "react";
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
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [memories, setMemories] = useState("");
  const [hasDelivery, setHasDelivery] = useState(false);

  const { createPhone, updatePhone } = usePhone();
  const { mutate: createMutate, isPending: isCreating } = createPhone();
  const { mutate: updateMutate, isPending: isUpdating } = updatePhone();

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setPrice(String(editingItem.price));
      setMemories(editingItem.memories.join(", "));
      setHasDelivery(editingItem.hasDelivery);
    } else {
      resetForm();
    }
  }, [editingItem]);

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setMemories("");
    setHasDelivery(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title,
      price: Number(price),
      memories: memories.split(",").map((m) => m.trim()),
      hasDelivery,
      id: editingItem?.id || "",
    };

    if (editingItem) {
      updateMutate(data, {
        onSuccess: () => {
          closeModal();
        },
      });
    } else {
      createMutate(data, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  const closeModal = () => {
    resetForm();
    setEditingItem(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-red-600 w-full ">
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form 
            onSubmit={handleSubmit}
            className="bg-white w-96 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editingItem ? "Edit Phone" : "Add Phone"}
            </h2>

            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 mb-4"
            />
            <input
              type="number"
              placeholder="Price..."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 mb-4"
            />
            <input
              type="text"
              placeholder="Memories (comma separated)..."
              value={memories}
              onChange={(e) => setMemories(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 mb-4"
            />

            <div className="flex items-center mb-4">
              <input
                id="hasDelivery"
                type="checkbox"
                checked={hasDelivery}
                onChange={(e) => setHasDelivery(e.target.checked)}
                className="mr-2 border border-gray-400 rounded-md"
              />
              <label htmlFor="hasDelivery">Has Delivery</label>
            </div>

            <div className="flex justify-center gap-3">
              {editingItem ? (
                <>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isCreating ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default React.memo(ModalWindow);
