import { EventHandler } from "@create-figma-plugin/utilities";

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}

export interface CreateExportHandler extends EventHandler {
  name: "CREATE_EXPORT";
  handler: () => void;
}

export interface CopyToClipboardHandler extends EventHandler {
  name: "COPY_TO_CLIPBOARD";
  handler: (json: string) => void;
}

export type StickyNote = {
  content: string;
  author: string;
  zone: string | undefined;
  votes: number;
};

export interface stampGroups {
  [key: string]: any;
}
