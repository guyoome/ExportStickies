import { once, showUI, emit } from "@create-figma-plugin/utilities";

import {
  CloseHandler,
  CreateExportHandler,
  CopyToClipboardHandler,
} from "./types";

import { createExport } from "./handlers/createExport";

export default () => {
  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });
  once<CreateExportHandler>("CREATE_EXPORT", () => {
    const json = createExport();
    emit<CopyToClipboardHandler>("COPY_TO_CLIPBOARD", json);
  });
  showUI({
    height: 137,
    width: 240,
  });
};
