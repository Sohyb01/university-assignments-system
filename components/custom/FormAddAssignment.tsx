"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormSchemaAddAssignment,
  TFormSchemaAddAssignment,
} from "@/lib/types-forms";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerDemo } from "@/components/ui/time-picker-demo";
import { courses } from "@/db/schema/courses";
import NullableInput from "@/components/ui/NullableInput";
import NullableTextarea from "@/components/ui/NullableTextarea";
import { uploadAssignmentAttachment } from "@/supabase/storage/client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { upsertAssignment } from "@/db/queries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { professors } from "@/db/schema/users";

const FormAddAssignment = ({
  editObj,
  availableCourses,
  availableProfessors,
}: {
  editObj?: TFormSchemaAddAssignment;
  availableCourses: (typeof courses.$inferSelect)[];
  availableProfessors: (typeof professors.$inferSelect)[];
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  const defaultValues = editObj
    ? { ...editObj, updated_at: new Date() }
    : {
        id_professor:
          session?.user.role === "professor" ? session.user.id : undefined,
        reward_egp: 0,
        reward_usd: 0,
      };

  const router = useRouter();

  const form = useForm<TFormSchemaAddAssignment>({
    resolver: zodResolver(FormSchemaAddAssignment),
    defaultValues,
  });

  const onSubmit = async (data: TFormSchemaAddAssignment) => {
    setSubmitting(true);

    // Upload file if provided
    let attachmentUrl = editObj?.attachment;
    if (data.attachment instanceof FileList && data.attachment.length > 0) {
      const upload = await uploadAssignmentAttachment({
        file: data.attachment[0],
        oldAttachmentUrl: editObj?.attachment,
      });
      if (upload.error) {
        toast.error("Upload failed, " + upload.error);
        setSubmitting(false);
        return;
      }
      attachmentUrl = upload.attachmentUrl;
    }

    const finalData = { ...data, attachment: attachmentUrl };
    const res = await upsertAssignment(finalData);

    if (res.success) {
      toast(res.message);
      router.push(
        `/dashboard/${session?.user.role}/courses/${data.id_course}/assignments`
      );
    } else {
      toast.error(res.error ?? res.message);
    }

    setSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pes-grid-form">
        {/* Title */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Link */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link (optional)</FormLabel>
              <FormControl>
                <NullableInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Due Date */}
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col mt-auto">
              <FormLabel>Due date</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal overflow-hidden h-10 mt-auto",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>Set date & time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    fromDate={new Date()}
                  />
                  <div className="p-3 border-t border-border">
                    <TimePickerDemo
                      setDate={field.onChange}
                      date={field.value}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        {/* Class */}
        <FormField
          control={form.control}
          name="id_course"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCourses.length > 0 ? (
                    availableCourses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                        <br />
                      </SelectItem>
                    ))
                  ) : (
                    <span className="unavailable-select">No courses</span>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instructor Selector */}
        {session?.user.role !== "professor" && (
          <FormField
            control={form.control}
            name="id_professor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose professor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableProfessors.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.first_name} {i.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Attachment */}
        <FormField
          control={form.control}
          name="attachment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  className="text-foreground"
                  type="file"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <NullableTextarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <NullableTextarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="md:col-span-2 flex gap-2 items-center"
          disabled={submitting}
        >
          {submitting && <Loader2 className="animate-spin" />}
          {submitting
            ? "Saving..."
            : editObj
              ? "Save changes"
              : "Create Assignment"}
        </Button>
      </form>
    </Form>
  );
};

export default FormAddAssignment;
