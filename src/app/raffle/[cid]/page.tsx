"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import RaffleDetails from "@/components/RaffleDetails";
import RaffleEnter from "@/components/RaffleEnter";
import EntriesList from "@/components/EntriesList";
import CloseModal from "@/components/CloseModal";
import { raffles } from "@/data";
import {
  fetchRaffle,
  fetchRaffles,
  getProviderReadonly,
} from "@/services/raffle";
import { Raffle } from "@/utils/interfaces";
import { toast } from "react-hot-toast";

export default function RafflePage() {
  const { cid } = useParams();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const program = useMemo(() => getProviderReadonly(), []);

  const refreshRaffle = useCallback(async () => {
    if (!program || !cid) return;
    try {
      const updatedRaffle = await fetchRaffle(program, cid as string);
      setRaffle(updatedRaffle);
    } catch (error) {
      console.error("Error fetching raffle:", error);
      toast.error("Failed to fetch raffle data");
    }
  }, [program, cid]);

  useEffect(() => {
    refreshRaffle();
  }, [refreshRaffle]);

  if (!raffle) return <h4>Raffle not found</h4>;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="bg-gray-100">
        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
            <RaffleDetails raffle={raffle} />
            <RaffleEnter
              raffle={raffle}
              pda={cid as string}
              onSuccess={refreshRaffle}
            />
          </div>
        </div>
      </div>
      <EntriesList entries={raffle.entries} />
      {raffle.entries.length === 0 && (
        <CloseModal
          raffle={raffle}
          pda={cid as string}
          onSuccess={refreshRaffle}
        />
      )}
    </div>
  );
}
