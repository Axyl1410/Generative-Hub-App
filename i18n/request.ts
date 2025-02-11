import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (
      await (locale === "vi"
        ? // When using Turbopack, this will enable HMR for `en`
          import("@/messages/vi.json")
        : import(`@/messages/${locale}.json`))
    ).default,
  };
});
