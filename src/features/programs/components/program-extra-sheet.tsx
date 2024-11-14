import * as React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useSheetStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import InputCustomNumber from "./input-custom-number";
import { convertToNumber, formatRupiah } from "@/lib/utils";
import { usePostProgramExtra } from "../hooks/post";
import { useGetProgramExtra } from "../hooks/get";
import CustomSheet from "@/components/custom-sheet";
import { ExtraFee, extraFeeSchema } from "../schema";

export const SHEET_ID = "PROGRAM_EXTRA_FEE_SHEET";

export default function ProgramExtraSheet({ id }: { id: number }) {
  const { getSheet } = useSheetStore();

  const { data } = useGetProgramExtra(
    id,
    getSheet(SHEET_ID + id)?.isOpen || false
  );

  const form = useForm<ExtraFee>({
    resolver: zodResolver(extraFeeSchema),
    defaultValues: {
      programId: 0,
      book: "",
      certificate: "",
      medal: "",
      trophy: "",
    },
  });

  const mutation = usePostProgramExtra();

  const onSubmit = (values: ExtraFee) => {
    mutation.mutate({
      ...values,
      programId: id,
      book: convertToNumber(values.book || "0"),
      certificate: convertToNumber(values.certificate || "0"),
      medal: convertToNumber(values.medal || "0"),
      trophy: convertToNumber(values.trophy || "0"),
    });
  };

  React.useEffect(() => {
    if (data && data.length) {
      const toObject = data.reduce((acc, item) => {
        acc[item.type!] = formatRupiah(item.price?.toString() || "0");
        return acc;
      }, {} as Record<string, string>);

      form.setValue("book", toObject.book);
      form.setValue("certificate", toObject.certificate);
      form.setValue("medal", toObject.medal);
      form.setValue("trophy", toObject.trophy);
    }
  }, [data, form]);

  return (
    <CustomSheet
      SHEET_ID={SHEET_ID + id}
      title="Program Extra"
      desc="Input price for extra things you can get by enrolled this program."
    >
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputCustomNumber form={form} name={"book"} label="Book" />
            <InputCustomNumber
              form={form}
              name={"certificate"}
              label="Certificate"
            />
            <InputCustomNumber form={form} name={"medal"} label="Medal" />
            <InputCustomNumber form={form} name={"trophy"} label="Trophy" />

            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? (
                <Loader2 className="w-h h-4  animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </CustomSheet>
  );
}
