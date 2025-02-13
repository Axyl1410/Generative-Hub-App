import {
  Formats,
  MessageKeys,
  NamespaceKeys,
  NestedKeyOf,
  NestedValueOf,
  RichTranslationValues,
  TranslationValues,
} from "next-intl";
import { ReactElement, ReactNode } from "react";

/**
 * The TFunction interface provides type-safe translation functionality with support for nested keys.
 *
 * @interface TFunction
 * @template NestedKey - The nested namespace key path within IntlMessages
 *
 * @example
 * ```typescript
 * // Basic usage
 * const t: TFunction = useTranslations();
 * t('user.name'); // returns translated string
 *
 * // With values
 * t('welcome', { name: 'John' }); // "Welcome John"
 *
 * // Rich text with React elements
 * t.rich('terms', {
 *   link: (chunks) => <a href="/terms">{chunks}</a>
 * });
 *
 * // Get raw translation object
 * const raw = t.raw('namespace.key');
 *
 * const getNavItems = (i18n: TFunction) => [
 *  { label: i18n("auth.login"), href: "/login" },
 *  { label: i18n("auth.register"), href: "/signup" },
 * ];
 *
 * {getNavItems(i18n).map((item) => (
 *   <li key={item.href}>
 *     <a href={item.href}>{item.label}</a>
 *   </li>
 *  ))}
 * ```
 *
 * @method t - Base translation method that returns a string
 * @param {string} key - The translation key to look up
 * @param {TranslationValues} [values] - Optional values to interpolate
 * @param {Partial<Formats>} [formats] - Optional format options
 * @returns {string} The translated string
 *
 * @method rich - Returns translation with React elements
 * @param {string} key - The translation key
 * @param {RichTranslationValues} [values] - Values containing React elements
 * @param {Partial<Formats>} [formats] - Optional format options
 * @returns {string | ReactElement | ReactNode} Translated content with React elements
 *
 * @method raw - Returns the raw translation data
 * @param {string} key - The translation key
 * @returns {any} Raw translation data
 */
export interface TFunction<
  NestedKey extends NamespaceKeys<
    IntlMessages,
    NestedKeyOf<IntlMessages>
  > = never,
> {
  <
    TargetKey extends MessageKeys<
      NestedValueOf<
        {
          "!": IntlMessages;
        },
        [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
      >,
      NestedKeyOf<
        NestedValueOf<
          {
            "!": IntlMessages;
          },
          [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
        >
      >
    >,
  >(
    key: TargetKey,
    values?: TranslationValues,
    formats?: Partial<Formats>
  ): string;
  rich<
    TargetKey extends MessageKeys<
      NestedValueOf<
        {
          "!": IntlMessages;
        },
        [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
      >,
      NestedKeyOf<
        NestedValueOf<
          {
            "!": IntlMessages;
          },
          [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
        >
      >
    >,
  >(
    key: TargetKey,
    values?: RichTranslationValues,
    formats?: Partial<Formats>
  ): string | ReactElement | ReactNode;
  raw<
    TargetKey extends MessageKeys<
      NestedValueOf<
        {
          "!": IntlMessages;
        },
        [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
      >,
      NestedKeyOf<
        NestedValueOf<
          {
            "!": IntlMessages;
          },
          [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
        >
      >
    >,
  >(
    key: TargetKey
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any;
}
