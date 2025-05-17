import { truncateAddress, isValidSolanaAddress } from "@/utils/helper";
import { Raffle } from "@/utils/interfaces";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getNFTAsset } from "@/services/raffle";
import { toast } from "react-hot-toast";

interface Props {
  raffle: Raffle;
}

const RaffleDetails: React.FC<Props> = ({ raffle }) => {
  const timeLeft = new Date(raffle.expiryDate).toLocaleString();
  const [nftData, setNftData] = useState<any>(null);
  const [nftImage, setNftImage] = useState<string | null>(null);
  const [isNFTPending, setIsNFTPending] = useState(false);

  const fetchNFTMetadata = async (jsonUri: string) => {
    try {
      const response = await fetch(jsonUri);
      const metadata = await response.json();
      if (metadata.image) {
        // Convert IPFS URL to HTTP URL if needed
        const imageUrl = metadata.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        setNftImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      setNftImage(null);
    }
  };

  const fetchNFTData = useCallback(async () => {
    if (!raffle.nftMint) {
      setNftData(null);
      setNftImage(null);
      return;
    }

    try {
      setIsNFTPending(true);
      const asset = await getNFTAsset(raffle.nftMint);
      setNftData(asset);

      if (asset?.content?.files?.[0]?.uri) {
        setNftImage(asset.content.files[0].uri);
      }
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      toast.error("Failed to fetch NFT data");
      setNftData(null);
      setNftImage(null);
    } finally {
      setIsNFTPending(false);
    }
  }, [raffle.nftMint]);

  useEffect(() => {
    fetchNFTData();
  }, [fetchNFTData]);

  return (
    <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Raffle Details</h2>

      {/* NFT Preview Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          NFT Preview
        </h3>
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
          {isNFTPending ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : nftImage ? (
            <Image
              src={nftImage}
              alt="NFT Preview"
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/600x400?text=NFT+Preview";
              }}
            />
          ) : (
            <div className="font-semibold text-lg absolute inset-0 flex items-center justify-center text-gray-500">
              {nftData ? "NFT Verified" : "Loading NFT..."}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          NFT Mint: {truncateAddress(raffle.nftMint)}
        </p>
      </div>

      <div className="grid  max-[360px]:grid-cols-1 grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-600">Raffle ID</p>
          <p className="text-base font-semibold">#{raffle.cid}</p>
        </div>
        <div>
          <p className="text-gray-600">Creator</p>
          <p className="text-base font-semibold">
            {truncateAddress(raffle.creator)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">NFT Mint</p>
          <p className="text-base font-semibold">
            {truncateAddress(raffle.nftMint)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Entry Fee</p>
          <p className="text-base font-semibold">{raffle.entryFee} SOL</p>
        </div>
        <div>
          <p className="text-gray-600">Maximum Entries</p>
          <p className="text-base font-semibold">{raffle.maxEntries}</p>
        </div>
        <div>
          <p className="text-gray-600">Current Entries</p>
          <p className="text-base font-semibold">{raffle.entries.length}</p>
        </div>
        <div>
          <p className="text-gray-600">Expiry Date</p>
          <p className="text-base font-semibold">{timeLeft}</p>
        </div>
        <div>
          <p className="text-gray-600">Status</p>
          <p className="text-base font-semibold">
            {raffle.active ? "Active" : "Closed"}
          </p>
        </div>
        {isValidSolanaAddress(raffle.winner) ? (
          <div>
            <p className="text-gray-600">Winner</p>
            <p className="text-base font-semibold">
              {truncateAddress(raffle.winner)}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Winner</p>
            <p className="text-base font-semibold">None</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaffleDetails;
