import { isValidSolanaAddress } from "@/utils/helper";
import { Raffle } from "@/utils/interfaces";
import Link from "next/link";
import React from "react";
import { FaUsers, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";

const RaffleCard: React.FC<{ raffle: Raffle }> = ({ raffle }) => {
  const entriesPercentage = Math.min(
    (raffle.entries.length / raffle.maxEntries) * 100,
    100
  );

  const timeLeft = new Date(raffle.expiryDate).toLocaleString();

  return (
    <div className="sm:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 truncate">
          Raffle #{raffle.cid}
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Entry Fee: {raffle.entryFee} SOL
        </p>
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${entriesPercentage}%` }}
            />
          </div>
          <div className="flex flex-col gap-1 mt-2 text-sm">
            <span className="text-gray-700 flex items-center space-x-1">
              <FaUsers className="text-black" />
              <strong>{raffle.entries.length}</strong> / {raffle.maxEntries}{" "}
              Entries
            </span>
            <span className="text-gray-700 flex items-center space-x-1">
              <FaClock className="text-green-500" />
              <span>Expires: {timeLeft}</span>
            </span>
            <span className="text-gray-700 flex items-center space-x-1">
              <FaSpinner className="text-green-500" />
              <span>Status: {raffle.active ? "Active" : "Closed"}</span>
            </span>
          </div>
        </div>
        <Link
          href={`/raffle/${raffle.publicKey}`}
          className="mt-4 w-full bg-green-600 hover:bg-green-700
          text-white text-sm font-semibold py-2 px-4 rounded-lg block text-center"
        >
          {isValidSolanaAddress(raffle.winner)
            ? "View Results"
            : "Enter Raffle"}
        </Link>
      </div>
    </div>
  );
};

export default RaffleCard;
