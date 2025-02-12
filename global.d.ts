type ViMessages = typeof import("@/messages/vi.json");
type EnMessages = typeof import("@/messages/en.json");

type Messages = ViMessages & EnMessages;

type IntlMessages = Messages;
