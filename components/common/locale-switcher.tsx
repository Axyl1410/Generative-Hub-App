"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale, usePathname, useRouter } from "@/i18n/routing";
import { ChevronDown, Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

const locales = [
  { value: "en", label: "English" },
  { value: "vi", label: "Tiếng Việt" },
];

export function LocaleSwitcherDropdown() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  function onChange(value: string) {
    const nextLocale = value as Locale;

    startTransition(() => {
      router.replace(`${pathname}?${new URLSearchParams(searchParams)}`, {
        locale: nextLocale,
      });
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isPending}>
          <Languages className="size-4" />
          <span className="uppercase">{locale}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          defaultValue={locale}
          value={locale}
          onValueChange={onChange}
        >
          {locales.map((val) => (
            <DropdownMenuRadioItem key={val.value} value={val.value}>
              {val.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
