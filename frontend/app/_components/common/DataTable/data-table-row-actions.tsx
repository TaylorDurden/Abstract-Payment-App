"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { accountSchema } from "./schema";
import SendFunds from "../Funds/send-funds";

// const SendFunds = React.lazy(() => import("../Funds/send-funds"));

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant="ghost"
    //       className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
    //     >
    //       <MoreHorizontal />
    //       <span className="sr-only">Open menu</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-[160px]">
    //     <DropdownMenuItem>
    //       <SendFunds accountIdString={account.id} />
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <>
      <SendFunds row={row} />
    </>
  );
}
