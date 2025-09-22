import { memo, useState } from "react";
import { usePhone, type IPhone } from "../../api/hooks/usePhone";
import ModalWindow from "../Modal";

const Phone = () => {
  const { getPhones, deletePhone } = usePhone();
  const { data, isLoading } = getPhones();
  const { mutate: removePhone } = deletePhone();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IPhone | null>(null);

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <div className="bg-blue-600 w-full">
        <header className="container mx-auto flex justify-between items-center  text-white px-6 py-4">
          <h1 className="text-xl font-semibold">📱 Phone Store</h1>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            + Add Phone
          </button>
        </header>
      </div>
      <ModalWindow
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {data?.map((phone: any) => (
          <div
            key={phone.id}
            className="max-w-sm w-full bg-white shadow-xl rounded-2xl p-5 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-2">{phone.title}</h2>
            <p className="text-gray-700 text-lg mb-3">
              💵 Price: <span className="font-bold">${phone.price}</span>
            </p>

            <div className="mb-3">
              <p className="font-medium text-gray-600 mb-1">Memories:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {phone.memories.map((m: any, idx: any) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            {phone.hasDelivery ? (
              <span className="block w-40 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                🚚 Delivery Available
              </span>
            ) : (
              <span className="block w-40 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                ❌ No Delivery
              </span>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingItem(phone);
                  setIsModalOpen(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm"
              >
                Update
              </button>
              <button
                onClick={() => removePhone(phone.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(Phone);
