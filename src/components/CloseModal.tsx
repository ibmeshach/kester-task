import { Raffle } from "@/utils/interfaces";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProvider, closeRaffle } from "@/services/raffle";
import { toast } from "react-toastify";

interface Props {
  raffle: Raffle;
  pda: string;
  onSuccess?: () => void;
}

const CloseModal: React.FC<Props> = ({ raffle, pda, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  const handleCloseRaffle = async () => {
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
      await toast.promise(closeRaffle(program, pda), {
        pending: "Closing raffle...",
        success: "Successfully closed raffle!",
        error: "Failed to close raffle",
      });

      // Call onSuccess callback after successful closure
      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      console.error("Error closing raffle:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to close raffle"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if raffle is not active or if user is not the creator
  if (!raffle.active || !publicKey || publicKey.toBase58() !== raffle.creator)
    return null;

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        Close Raffle
      </button>

      {isOpen && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Close Raffle</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to close this raffle? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                onClick={handleCloseRaffle}
                disabled={isLoading}
              >
                {isLoading ? "Closing..." : "Close Raffle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CloseModal;
