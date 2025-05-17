import { Raffle } from "@/utils/interfaces";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProvider, enterRaffle, pickWinner } from "@/services/raffle";
import { toast } from "react-toastify";
import { isValidSolanaAddress } from "@/utils/helper";

interface Props {
  raffle: Raffle;
  pda: string;
  onSuccess?: () => void;
}

const RaffleEnter: React.FC<Props> = ({ raffle, pda, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  const handleEnterRaffle = async () => {
    if (!publicKey || !signTransaction || !sendTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const program = getProvider(publicKey, signTransaction, sendTransaction);
      if (!program) {
        throw new Error("Failed to initialize program");
      }

      setIsLoading(true);
      await toast.promise(enterRaffle(program, pda, raffle.entryFee), {
        pending: "Entering raffle...",
        success: "Successfully entered raffle!",
        error: "Failed to enter raffle",
      });

      // Call onSuccess callback after successful entry
      onSuccess?.();
    } catch (error) {
      console.error("Error entering raffle:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to enter raffle"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickWinner = async () => {
    if (!publicKey || !signTransaction || !sendTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const program = getProvider(publicKey, signTransaction, sendTransaction);
      if (!program) {
        throw new Error("Failed to initialize program");
      }

      setIsLoading(true);
      await toast.promise(pickWinner(program, pda), {
        pending: "Picking winner...",
        success: "Successfully picked winner!",
        error: "Failed to pick winner",
      });

      // Call onSuccess callback after successful winner selection
      onSuccess?.();
    } catch (error) {
      console.error("Error picking winner:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to pick winner"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const now = new Date();
  const endDate = new Date(raffle.expiryDate);
  const isRaffleActive = now < endDate;
  const isCreator = publicKey?.toBase58() === raffle.creator;
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Enter Raffle</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Entry Fee</p>
          <p className="text-lg font-semibold">{raffle.entryFee} SOL</p>
        </div>
        <div>
          <p className="text-gray-600">Entries</p>
          <p className="text-lg font-semibold">
            {raffle.entries.length} / {raffle.maxEntries}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Status</p>
          <p className="text-lg font-semibold">
            {raffle.active ? "Active" : "Closed"}
          </p>
        </div>
        {raffle.active && isRaffleActive ? (
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg disabled:opacity-50"
            onClick={handleEnterRaffle}
            disabled={isLoading || !publicKey}
          >
            {isLoading ? "Entering..." : "Enter Raffle"}
          </button>
        ) : isRaffleActive === false ? (
          <p className="text-gray-600 text-2xl font-bold">Raffle has expired</p>
        ) : (
          <p className="text-gray-600 text-2xl font-bold">Raffle is closed</p>
        )}

        {!isRaffleActive &&
          raffle.active &&
          isCreator &&
          isValidSolanaAddress(raffle.winner) === false && (
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg disabled:opacity-50"
              onClick={handlePickWinner}
              disabled={isLoading || !publicKey}
            >
              {isLoading ? "Picking Winner..." : "Pick Winner"}
            </button>
          )}
      </div>
    </div>
  );
};

export default RaffleEnter;
