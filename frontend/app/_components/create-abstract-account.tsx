"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateAccountMonarchy } from "@abstract-money/react";
import { useAccount } from "graz";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import NameInput from "./common/NameInput";
import { ActionDialog } from "./common/Dialog";
import { appChain } from "@/utils/chains";
import { useAccountContext } from "../_providers/accountProvider";
import { showLoadingToast } from "./common/Loading/loading-toast";

const FormSchema = z.object({
  accountName: z.string().min(2, {
    message: "Account Name must be at least 2 characters.",
  }),
});

const title = "Create Account";

export function CreateAccountForm() {
  const { dispatch } = useAccountContext();
  const [openDialog, setOpenDialog] = useState(false);
  const { toast, dismiss } = useToast();
  const { mutate: createAccount, isLoading: isCreating } =
    useCreateAccountMonarchy({
      chainName: appChain.chainName,
    });
  const { data } = useAccount();
  const address = data?.bech32Address;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      accountName: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    showLoadingToast("Submitting...");
    createAccount(
      {
        args: {
          name: data.accountName,
          namespace: data.accountName,
          owner: address!,
        },
        fee: "auto",
      },
      {
        onSuccess: () => {
          dismiss();
          toast({
            title: "Transaction Succeed",
            description: "Create account successfully.",
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
      disabled={isCreating}
      open={openDialog}
      onOpenChange={setOpenDialog}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <NameInput required label="Account Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </ActionDialog>
  );
}
