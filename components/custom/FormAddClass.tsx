"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchemaAddCourse, TFormSchemaAddCourse } from "@/lib/types-forms";
import { Loader2 } from "lucide-react";
import NullableInput from "@/components/ui/NullableInput";
import { upsertCourse } from "@/app/actions/form-submissions";
import { courses } from "@/db/schema/courses";
import { createDefaultValues } from "@/lib/common-functions";
import { professors, students } from "@/db/schema/users";
import { MultiSelect } from "@/components/ui/multiselect";

const FormAddCourse = ({
  editObj,
  availableInstructors,
  availableStudents,
}: {
  editObj?: TFormSchemaAddCourse;
  availableInstructors: (typeof professors.$inferSelect)[];
  availableStudents: (typeof students.$inferSelect)[];
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = editObj
    ? { ...editObj, updated_at: new Date() }
    : createDefaultValues(courses);

  const form = useForm<TFormSchemaAddCourse>({
    resolver: zodResolver(FormSchemaAddCourse),
    defaultValues,
  });

  const onSubmit = async (data: TFormSchemaAddCourse) => {
    setIsSubmitting(true);

    const res = await upsertCourse({ ...data, id: editObj?.id });
    if (!res.success) {
      toast.error("Error, " + res.message);
      setIsSubmitting(false);
      return;
    }

    toast(editObj ? "Changes saved" : "Course added");
    form.reset(defaultValues);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pes-grid-form">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course name</FormLabel>
              <FormControl>
                <NullableInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="professors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Instructors</FormLabel>
              <FormControl>
                <MultiSelect
                  options={availableInstructors.map((ins) => ({
                    value: ins.id,
                    label: `${ins.first_name} ${ins.last_name}`,
                  }))}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Choose professors..."
                  emptyText="No professors found."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="students"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Students</FormLabel>
              <FormControl>
                <MultiSelect
                  options={availableStudents.map((stud) => ({
                    value: stud.id,
                    label: `${stud.first_name} ${stud.last_name}`,
                  }))}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Choose students..."
                  emptyText="No students found."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit" className="md:col-span-2">
          {isSubmitting && <Loader2 className="animate-spin" />}
          {editObj ? "Save changes" : "Add class"}
        </Button>
      </form>
    </Form>
  );
};

export default FormAddCourse;
