"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  emptyText = "No options found.",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = React.useCallback(
    (value: string) => {
      const updatedSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(updatedSelected);
    },
    [selected, onChange]
  );

  const selectedLabels = React.useMemo(
    () =>
      selected
        .map((value) => options.find((option) => option.value === value)?.label)
        .filter(Boolean)
        .join(", "),
    [selected, options]
  );

  // **Manual filtering based on label instead of value**
  const filteredOptions = React.useMemo(
    () =>
      searchTerm
        ? options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : options, // If no search term, show all options
    [searchTerm, options]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate text-subtle">
            {selected.length > 0 ? selectedLabels : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {/* Capture search input manually */}
          <CommandInput
            placeholder="Search..."
            value={searchTerm}
            onValueChange={setSearchTerm} // Custom handling of search term
          />
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty className="p-4 text-muted-foreground text-subtle">
                {emptyText}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
