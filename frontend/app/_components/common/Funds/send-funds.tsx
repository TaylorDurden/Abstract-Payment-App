"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWithdraw } from "@abstract-money/react";
import { stringToAccountId } from "@abstract-money/core";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ActionDialog } from "../Dialog";
import { Input } from "@/components/ui/input";
import { appChain } from "@/utils/chains";
import { DataTableRowActionsProps } from "../DataTable/data-table-row-actions";
import { accountSchema } from "../DataTable/schema";
import { validateBech32Address } from "@/utils/address";
import { useToast } from "@/hooks/use-toast";
import { ntrn2untrn, untrn2Ntrn } from "@/utils/conversion";
import { useAccountContext } from "@/app/_providers/accountProvider";
import { showLoadingToast } from "../Loading/loading-toast";

const title = "Send Funds";

export default function SendFunds<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { dispatch } = useAccountContext();
  const { toast, dismiss } = useToast();
  const account = accountSchema.parse(row.original);
  const [openDialog, setOpenDialog] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const sendFunds = useWithdraw({
    accountId: stringToAccountId(account.id),
    chainName: appChain.chainName,
  });
  const balanceInNTRN =
    untrn2Ntrn(
      Number(account.balances.find((x) => x.denom === "untrn")?.amount ?? 0)
    ) ?? 0;
  const formSchema = z.object({
    amount: z
      .number()
      .min(0.0000000000000000000001, {
        message: "Invalid amount",
      })
      .refine((value) => value <= balanceInNTRN, {
        message: `Amount must not exceed available balance (${balanceInNTRN} NTRN).`,
      }),
    recipient: z.string().refine(
      (value) => {
        const { valid } = validateBech32Address(value);
        return valid;
      },
      {
        message: "Invalid bech32 address",
      }
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      recipient: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setDisabled(true);
    showLoadingToast("Submitting...");
    sendFunds.mutate(
      {
        fee: "auto",
        args: {
          assets: [
            {
              denom: "untrn",
              amount: ntrn2untrn(data.amount).toString(),
              type: "native",
            },
          ],
          recipient: data.recipient,
        },
      },
      {
        onSuccess: () => {
          dismiss();
          toast({
            title: "Transaction Successful",
            description: "Funds sent successfully.",
          });
          dispatch({ type: "START_FETCH_ACCOUNTS" });
          setOpenDialog(false);
        },
        onError: (error: any) => {
          dismiss();
          toast({
            title: "Transaction Failed",
            description: error.message || "Something went wrong.",
          });
          dispatch({ type: "START_FETCH_ACCOUNTS" });
          setOpenDialog(false);
        },
      }
    );
  }

  return (
    <ActionDialog
      triggerTitle={title}
      dialogTitle={title}
      disabled={disabled}
      open={openDialog}
      onOpenChange={setOpenDialog}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="flex items-center p-4 bg-black text-white rounded-md">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full">
              <svg
                className="w-5 h-5 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 3a6 6 0 110 12 6 6 0 010-12zM12 9h9"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-medium">NTRN</p>
              <p className="text-sm text-gray-400">Neutron Testnet</p>
            </div>
          </div>
          <div className="ml-auto text-lg font-semibold">
            {balanceInNTRN > 0 ? balanceInNTRN.toFixed(6) : balanceInNTRN}
          </div>
        </div>

        <Form {...form}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <Input id="recipient" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      id="amount"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(value);
                        setDisabled(!(value > 0));
                      }}
                      step="any"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
    </ActionDialog>
  );
}
