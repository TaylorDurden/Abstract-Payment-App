import { useEffect } from "react";
import { z } from "zod";

import { useAccountsMetadataGraphQLQuery } from "@/app/_hooks/useQueryAccountsById";
import { useAccountContext } from "@/app/_providers/accountProvider";
import { appChain } from "@/utils/chains";
import { useAccounts } from "@abstract-money/react";
import { accountSchema } from "../DataTable/schema";
import { columns } from "../DataTable/columns";
import { DataTable } from "../DataTable/data-table";
import { showLoadingToast } from "../Loading/loading-toast";
import { useToast } from "@/hooks/use-toast";

interface AccountListProps {
  address: string;
}

const AccountList: React.FC<AccountListProps> = ({
  address,
}: AccountListProps) => {
  const { chainName } = appChain;
  const { dismiss } = useToast();
  const { state, dispatch } = useAccountContext();

  const {
    data: accounts,
    refetch: refetchAccounts,
    isFetching: isFetchingAccounts,
  } = useAccounts({
    args: {
      owner: address,
      chains: [chainName],
    },
  });
  const {
    data: accountsMetadata,
    isFetching: isFetchingAccountsMetadata,
    refetch: refetchAccountsMetadata,
  } = useAccountsMetadataGraphQLQuery({ accountIds: accounts });
  useEffect(() => {
    if (state.fetchAccounts) {
      const fetchAccounts = async () => {
        try {
          await refetchAccounts();
          await refetchAccountsMetadata();
          dispatch({ type: "STOP_FETCH_ACCOUNTS" });
        } catch (error) {
          console.error("Error fetching accounts:", error);
        }
      };

      fetchAccounts();
    }
    if (isFetchingAccounts || isFetchingAccountsMetadata) {
      showLoadingToast("Loading...");
    } else {
      dismiss();
    }
  }, [
    state.fetchAccounts,
    refetchAccounts,
    dispatch,
    isFetchingAccounts,
    isFetchingAccountsMetadata,
  ]);

  let accountData;
  if (accountsMetadata) {
    accountData = z.array(accountSchema).parse(accountsMetadata);
  }

  const handleRefresh = async () => {
    try {
      await refetchAccounts();
      await refetchAccountsMetadata();
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  return (
    <>
      {isFetchingAccounts || isFetchingAccountsMetadata ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          data={accountData ?? []}
          columns={columns}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
};

export default AccountList;
