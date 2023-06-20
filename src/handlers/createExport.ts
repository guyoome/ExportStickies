import { StickyNote } from "../types";

import { getStampsNearNode, getSectionNearNode } from "../utils/nodes";

export const createExport = () => {
  const stickyNodes: StickyNode[] = figma.currentPage.findAllWithCriteria({
    types: ["STICKY"],
  });

  const stickies: StickyNote[] = [];

  // Find all stamps on the page
  const stampsNodes: StampNode[] = figma.currentPage.findAllWithCriteria({
    types: ["STAMP"],
  });

  // Find all stamps on the page
  const sectionsNodes: SectionNode[] = figma.currentPage.findAllWithCriteria({
    types: ["SECTION"],
  });

  stickyNodes.forEach((sticky) => {
    let stampVotes = getStampsNearNode(stampsNodes, sticky);

    let section = getSectionNearNode(sectionsNodes, sticky);

    let votes = stampVotes["+1"]?.length;
    if (votes === undefined) {
      votes = 0;
    }
    const note: StickyNote = {
      content: sticky.name,
      author: sticky.authorName,
      zone: section,
      votes: votes,
    };
    stickies.push(note);
  });

  figma.currentPage.selection = stickyNodes;
  figma.viewport.scrollAndZoomIntoView(stickyNodes);

  return JSON.stringify(stickies);
};
