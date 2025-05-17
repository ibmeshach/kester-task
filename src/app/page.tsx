"use client";

import RaffleCard from "@/components/RaffleCard";
import RaffleHero from "@/components/RaffleHero";
import { raffles as dummyRaffles } from "../data";
import { fetchRaffles, getProviderReadonly } from "@/services/raffle";
import { useEffect, useMemo, useState } from "react";
import { Raffle } from "@/utils/interfaces";

export default function Page() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [filter, setFilter] = useState<string>("");
  const program = useMemo(() => getProviderReadonly(), []);

  console.log(raffles);

  useEffect(() => {
    fetchRaffles(program, filter).then((raffles) => {
      setRaffles(raffles || []);
    });
  }, [program, filter]);
  return (
    <div className="container mx-auto p-6">
      <RaffleHero />
      <div className="h-10" />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Explore Raffles</h1>
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
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {raffles.map((raffle) => (
            <RaffleCard key={raffle.cid} raffle={raffle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-800">
            No raffles available at the moment
          </h2>
          <p className="text-gray-600 mt-4">
            Be the first to create a raffle and win amazing NFTs!
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
  );
}
