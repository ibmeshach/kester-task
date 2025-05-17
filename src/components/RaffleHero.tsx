import Image from "next/image";
import Link from "next/link";
import React from "react";

const RaffleHero = () => {
  return (
    <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 px-6 md:px-12">
      <div className="container mx-auto text-center md:text-left">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-12 lg:gap-6">
          <div className="w-full lg:w-1/2 mb-10 md:mb-0 max-lg:text-center">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Win Amazing NFTs Through Raffles
            </h1>
            <p className="mt-4 text-lg lg:text-xl text-white/90">
              Enter exciting NFT raffles on Solana. Join the community,
              participate in fair draws, and win exclusive digital collectibles.
            </p>
            <div className="mt-6 flex max-sm:flex-col gap-4 sm:gap-2 max-lg:justify-center">
              <Link
                href="/account"
                className="bg-white text-green-600 hover:bg-green-100 font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
              >
                Explore Raffles
              </Link>
              <Link
                href="/create"
                className="ml-4 text-white bg-green-600 hover:bg-green-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
              >
                Create Raffle
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="https://cdn.pixabay.com/photo/2015/02/27/18/31/money-652560_960_720.jpg"
              alt="Crowdfunding Illustration"
              width={576}
              height={384}
              className="w-full rounded-lg shadow-lg h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RaffleHero;
