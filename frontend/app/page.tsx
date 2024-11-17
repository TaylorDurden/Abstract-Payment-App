"use client";

import { useAccount as graz_useAccount } from "graz";

import { CreateAccountForm } from "./_components/create-abstract-account";
import { appChain } from "@/utils/chains";
import Header from "./_components/common/Header";
import AccountList from "./_components/common/AccountList";

export default function Home() {
  const { chainId } = appChain;
  const { data: cosmosAccount } = graz_useAccount({ chainId });

  return (
    <>
      {cosmosAccount?.bech32Address ? (
        <div className="hidden flex-col md:flex">
          <Header />
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <CreateAccountForm />
              </div>
            </div>
            <AccountList address={cosmosAccount.bech32Address} />
          </div>
        </div>
      ) : (
        <Header />
      )}
    </>
  );
}
