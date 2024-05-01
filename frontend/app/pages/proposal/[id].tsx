import React, { useEffect, useState } from "react";
//import Layout from "@/components/common/Layout";
import PageWrapper from "@/components/PageWrapper";

import DaoLayout from "@/components/DaoLayout";
import { useRouter } from "next/router";
import { useContractWrite, useNetwork } from "wagmi";
//import { ADDRESSES } from "@/constants/addresses";
//import { ABI } from "@/constants/abi";

const SingleProposal = () => {
  const router = useRouter();
  const { id } = router.query;
  //const { chain } = useNetwork();
  const [chainId, setChainId] = useState<
    97 | 80001 | 43113 | (() => 97 | 80001 | 43113)
  >(97);

  // useEffect(() => {
  //   if (chain) {
  //     setChainId(chain.id as 97 | 80001 | 43113);
  //   }
  // }, [chain]);

  // const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
  //   mode: "recklesslyUnprepared",
  //   address: ADDRESSES[chainId as keyof typeof ADDRESSES]
  //     .CROSSCHAIN_DAO as `0x${string}`,
  //   abi: ABI.dao,
  // });

  const [vote, setVote] = useState("");

  const obj = {
    title: "Add the blueprint regimen to the shop",
    status: "Open",
    description:
      "I am proposing that the blueprint brand by bryan johnson should be included in the greenspace shop as it is very good and has worked for me, vote for this proposal if you stand with me",
    proposer: "0x5e869af2Af006B538f9c6D231C31DE7cDB4153be",
    proposedOn: "2024-04-01",
    currentVotes: 100,
    current_yes_votes: 39,
    current_no_votes: 24,
    current_abstain_votes: 37,
  };

  return (
    <DaoLayout>
      <div className="text-white max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col max-w-3xl">
          <p
            className={`
                        text-lg font-semibold underline pb-4 text-[#8E8F94]
                        ${obj.status === "Open" ? "text-lime" : ""}
                        ${obj.status === "Expired" ? "text-red-500" : ""}
                        ${obj.status === "Closed" ? "text-orange-500" : ""}
                        `}
          >
            {obj.status}
          </p>
          <p className="text-2xl lg:text-4xl font-bold text-lime">
            {obj.title}
          </p>

          {/* Description */}
          <p className="lg:text-lg py-8 text-[#8E8F94">{obj.description}</p>
        </div>

        {/* Proposer and date proposed */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center py-8 lg:py-12">
          <div className="flex flex-col items-start">
            <p className="font-semibold text-[#8E8F94]">Proposed by</p>
            <p className="font-semibold text-white">
              {obj.proposer.substring(0, 6) + "..." + obj.proposer.slice(-4)}
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-center">
            <p className="font-semibold text-[#8E8F94]">Proposed on</p>
            <p className="font-semibold text-white">{obj.proposedOn}</p>
          </div>
        </div>

        {/* Vote */}
        <div className="flex flex-col gap-8 max-w-3xl py-6">
          <p className="text-2xl lg:text-3xl text-lime">Vote</p>

          <div
            onClick={() => setVote("yes")}
            className={`w-full h-12 border flex items-center px-4 cursor-pointer
            ${vote === "yes" ? "bg-[#2b324b]" : ""}
            `}
          >
            <p className={`text-lime`}>Yes</p>
          </div>
          <div
            onClick={() => setVote("no")}
            className={`w-full h-12 border flex items-center px-4 cursor-pointer
            ${vote === "no" ? "bg-[#2b324b]" : ""}
            `}
          >
            <p className="text-red-500">No</p>
          </div>
          <div
            onClick={() => setVote("abstain")}
            className={`w-full h-12 border flex items-center px-4 cursor-pointer
            ${vote === "abstain" ? "bg-[#2b324b]" : ""}
            `}
          >
            <p className={`text-orange-500`}>Abstain</p>
          </div>
        </div>

        {/* Vote button */}
        <div className="flex  flex-col gap-8 max-w-3xl py-6 mb-10">
          <button
            className="long-btn bg-[#edc02c] text-black py-4 uppercase"
            onClick={() => console.log("Voted")}
          >
            Vote
          </button>
        </div>

        {/* Current votes */}
        <p className="text-2xl lg:text-3xl text-lime">Current results</p>
        <div className="flex flex-col py-8 my-8 px-6 gap-8 max-w-[700px] bg-[#101524]">
          {/* Yes votes */}
          <VoteDetails
            title="Yes"
            votes={obj.current_yes_votes}
            totalVotes={obj.currentVotes}
          />
          {/* No votes */}
          <VoteDetails
            title="No"
            votes={obj.current_no_votes}
            totalVotes={obj.currentVotes}
          />
          {/* Abstain votes */}
          <VoteDetails
            title="Abstain"
            votes={obj.current_abstain_votes}
            totalVotes={obj.currentVotes}
          />
        </div>
      </div>
    </DaoLayout>
  );
};

export default SingleProposal;

interface VoteDetailsProps {
  title: string;
  votes: number;
  totalVotes: number;
}

const VoteDetails = ({ title, votes, totalVotes }: VoteDetailsProps) => (
  <div className="flex flex-col items-start gap-2">
    {/* Ranger */}
    <div className="flex items-center w-full bg-[#2b324b]">
      <div
        className={`h-2 rounded-full
        ${title === "Yes" ? "bg-blue-500" : ""}
        ${title === "No" ? "bg-red-500" : ""}
        ${title === "Abstain" ? "bg-orange-500" : ""}
        `}
        style={{ width: `${(votes / totalVotes) * 100}%` }}
      ></div>
    </div>
    <div className="flex w-full justify-between">
      <p className="text-lg font-semibold text-[#8E8F94]">{title}</p>
      <p className="text-lg font-semibold text-white">
        {(votes / totalVotes) * 100} %
      </p>
    </div>
  </div>
);
