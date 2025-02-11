import React from "react";

const SettingPage: React.FC = () => {
  return (
    <main className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex justify-center">
        <img
          src="https://placehold.co/400x600"
          alt="NFT image"
          className="rounded-lg shadow-lg"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold text-blue-600">
          Otherside Koda <i className="fas fa-check-circle text-blue-500"></i>
        </h2>
        <h3 className="mt-2 text-2xl font-bold">#1972</h3>
        <p className="text-gray-500">
          Owned by <span className="text-blue-600">A99D74</span>
        </p>
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-gray-500">
            <i className="fas fa-eye"></i> 60 views
          </span>
          <span className="text-gray-500">
            <i className="fas fa-gamepad"></i> Gaming
          </span>
        </div>
        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <p className="text-gray-500">
            Sale ends January 24, 2025 at 12:47 AM
          </p>
          <div className="mt-2 flex space-x-2">
            <div className="text-center">
              <p className="text-2xl font-bold">00</p>
              <p className="text-gray-500">Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">50</p>
              <p className="text-gray-500">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">32</p>
              <p className="text-gray-500">Seconds</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xl font-bold">Current price</p>
          <p className="text-2xl font-bold">
            1.22 ETH <span className="text-gray-500">$4,001.06</span>
          </p>
          <div className="mt-4 flex space-x-4">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              Buy now
            </button>
            <button className="rounded-lg bg-gray-200 px-4 py-2">
              Make offer
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-bold">Price History</h4>
          <img
            src="https://placehold.co/400x200"
            alt="Price history graph"
            className="mt-2 w-full"
          />
        </div>
      </div>
    </main>
  );
};

export default SettingPage;
