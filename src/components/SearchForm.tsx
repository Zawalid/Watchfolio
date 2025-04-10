"use client";

import Form from "next/form";
import Input, { InputProps } from "./ui/Input";
import SearchButton, { ResetButton } from "./SearchFormButtons";

interface Props extends InputProps {
  parentClassName?: string;
  query?: string;
}

export default function SearchForm({ parentClassName, query, ...props }: Props) {
  return (
    <Form
      action=""
      className={`flex gap-2 ${parentClassName}`}
      id="search-form"
      onSubmit={(e) => {
        const form = e.target as HTMLFormElement;
        if (form.query.value.trim() === "") e.preventDefault();
      }}
    >
      <Input type="text" icon="search" parentclassname="flex-1" name="query" defaultValue={query} {...props}>
        {query && <ResetButton />}
      </Input>
      <SearchButton />
    </Form>
  );
}
