"use client";

import React, { useEffect, useMemo, useState } from "react";
import RaffleCard from "@/components/RaffleCard";
import { fetchRafflesByCreator, getProviderReadonly } from "@/services/raffle";
import { Raffle } from "@/utils/interfaces";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Page() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [filter, setFilter] = useState<string>("");
  const program = useMemo(() => getProviderReadonly(), []);
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey) {
      fetchRafflesByCreator(program, publicKey.toString()).then(
        (creatorRaffles) => {
          if (filter === "active") {
            setRaffles(creatorRaffles.filter((raffle) => raffle.active));
          } else if (filter === "closed") {
            setRaffles(creatorRaffles.filter((raffle) => !raffle.active));
          } else {
            setRaffles(creatorRaffles);
          }
        }
      );
    }
  }, [program, filter, publicKey]);

  return (
    <div className="container mx-auto p-6 w-full gap-6">
      {/* Left side */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Raffles</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("")}
              className={`font-semibold py-2 px-4 rounded-lg ${
                filter === ""
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`font-semibold py-2 px-4 rounded-lg ${
                filter === "active"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("closed")}
              className={`font-semibold py-2 px-4 rounded-lg ${
                filter === "closed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Closed
            </button>
          </div>
        </div>
        {raffles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {raffles.map((raffle) => (
              <RaffleCard key={raffle.cid} raffle={raffle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-800">
              You have no raffles available at the moment
            </h2>
            <p className="text-gray-600 mt-4">
              Create your first NFT raffle and start collecting entries!
            </p>

            <div className="mt-6">
              <a
                href="/create"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Create a Raffle
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
