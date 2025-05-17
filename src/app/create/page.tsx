"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";
import { getNFTAsset, getProvider, initializeRaffle } from "@/services/raffle";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isNFTPending, setIsNFTPending] = useState(false);
  const [nftData, setNftData] = useState<any>(null);
  const [nftImage, setNftImage] = useState<string | null>(null);
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  );

  // Local form state
  const [form, setForm] = useState({
    nftMint: "",
    entryFee: "",
    maxEntries: "",
    expiryDate: "",
  });

  // Get today's date in YYYY-MM-DDThh:mm format for the datetime-local input
  const today = new Date().toISOString().slice(0, 16);

  const debouncedNFTMint = useDebounce(form.nftMint, 500);

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

  const fetchNFTData = async (mintAddress: string) => {
    if (!mintAddress) {
      setNftData(null);
      setNftImage(null);
      return;
    }

    try {
      setIsNFTPending(true);
      const asset = await getNFTAsset(mintAddress);
      setNftData(asset);

      if (asset.content?.json_uri) {
        await fetchNFTMetadata(asset.content.json_uri);
      }
    } catch (error) {
      console.error("Error fetching NFT:", error);
      setNftData(null);
      setNftImage(null);
    } finally {
      setIsNFTPending(false);
    }
  };

  useEffect(() => {
    if (debouncedNFTMint) {
      fetchNFTData(debouncedNFTMint);
    } else {
      setNftData(null);
      setNftImage(null);
    }
  }, [debouncedNFTMint]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!publicKey || !signTransaction || !sendTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      if (!program) {
        throw new Error("Failed to initialize program");
      }

      setIsLoading(true);
      await toast.promise(
        initializeRaffle(
          program,
          form.nftMint,
          parseFloat(form.entryFee),
          parseInt(form.maxEntries),
          Math.floor(new Date(form.expiryDate).getTime() / 1000)
        ),
        {
          pending: "Creating raffle...",
          success: "Raffle created successfully!",
          error: "Failed to create raffle",
        }
      );

      // Reset form after successful creation
      setForm({
        nftMint: "",
        entryFee: "",
        maxEntries: "",
        expiryDate: "",
      });

      setIsLoading(false);
      router.push(`/account`);
    } catch (error) {
      console.error("Error creating raffle:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create raffle"
      );
      setIsLoading(false);
    }
  };

  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.showPicker();
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only arrow keys, tab, and enter
    if (
      ![
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Enter",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Raffle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 mb-2">NFT Mint Address</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter the NFT mint address"
              value={form.nftMint}
              onChange={(e) => setForm({ ...form, nftMint: e.target.value })}
              className="w-full p-2 border rounded text-black pr-10"
              required
            />
            {isNFTPending && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
              {nftData && !isNFTPending && (
                <div className="text-xl  font-semibold p-4">NFT Verified</div>
              )}{" "}
              {isNFTPending ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : nftImage ? (
                <div className="flex flex-col items-center justify-center">
                  {" "}
                  <Image
                    src={nftImage}
                    alt="NFT Preview"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://placehold.co/600x400?text=NFT+Preview";
                    }}
                  />
                </div>
              ) : form.nftMint ? (
                <div className="font-semibold  text-lg absolute inset-0 flex items-center justify-center text-gray-500">
                  NFT not found
                </div>
              ) : (
                <div className="font-semibold  text-lg absolute inset-0 flex items-center justify-center text-gray-500">
                  Input NFT mint address to preview and verify your NFT
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Entry Fee (SOL)</label>
          <input
            type="text"
            placeholder="Enter entry fee in SOL"
            value={form.entryFee}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d{0,9}$/.test(value)) {
                setForm({ ...form, entryFee: value });
              }
            }}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Maximum Entries</label>
          <input
            type="number"
            placeholder="Enter maximum number of entries"
            min="1"
            max="255"
            value={form.maxEntries}
            onChange={(e) => setForm({ ...form, maxEntries: e.target.value })}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Expiry Date</label>
          <div className="relative">
            <input
              type="datetime-local"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              min={today}
              onClick={handleDateClick}
              onKeyDown={handleDateKeyDown}
              className="w-full p-2 border rounded text-black pr-10 cursor-pointer"
              required
            />
          </div>
        </div>

        <div className="mt-4 space-x-4 flex justify-start items-center">
          <button
            type="submit"
            disabled={
              isLoading ||
              !form.nftMint ||
              !form.entryFee ||
              !form.maxEntries ||
              !form.expiryDate ||
              isNFTPending ||
              (!nftData && !nftImage)
            }
            className="disabled:opacity-50 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {isLoading ? "Loading..." : "Create Raffle"}
          </button>
        </div>
      </form>
    </div>
  );
}
