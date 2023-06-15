import { once, showUI, emit } from '@create-figma-plugin/utilities'

import { CloseHandler, CopyToClipboardHandler, TestHandler, StickyNote } from './types'

export default function () {
  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin()
  });
  once<CopyToClipboardHandler>('COPY_TO_CLIPBOARD', function () {
    const nodes = figma.root.findAllWithCriteria({
      types: ['STICKY']
    })

    const stickies: StickyNote[] = [];

    nodes.forEach(sticky => {
      const note: StickyNote = {
        content: sticky.name,
        author: sticky.authorName,
        zone: sticky.parent?.name
      }
      stickies.push(note);
    });

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    emit<TestHandler>('TEST_COPY', JSON.stringify(stickies))
  })
  showUI({
    height: 137,
    width: 240
  });
}
