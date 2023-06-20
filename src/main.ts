import { once, showUI, emit } from '@create-figma-plugin/utilities'

import { CloseHandler, CopyToClipboardHandler, TestHandler, StickyNote } from './types';

interface stampGroups {
  [key: string]: any;
}

function isWithinProximity(node1: SceneNode, node2: SceneNode, tolerance = 40) {

  let node1Center = { x: node1.absoluteBoundingBox!.x + node1.width / 2, y: node1.absoluteBoundingBox!.y + node1.height / 2 };
  let node2Center = { x: node2.absoluteBoundingBox!.x + node2.width / 2, y: node2.absoluteBoundingBox!.y + node2.height / 2 };
  let proximityWidth = node1.width / 2 + tolerance;
  let proximityHeight = node1.height / 2 + tolerance;

  return Math.abs(node1Center.x - node2Center.x) <= proximityWidth && Math.abs(node1Center.y - node2Center.y) <= proximityHeight;
}

// Find all votes (stamps) attributed to a sticky (by proximity)
function getStampsNearNode(stamps: StampNode[], sticky: StickyNode) {

  let stampGroups: stampGroups = {};

  stamps.forEach(stamp => {
    if (isWithinProximity(sticky, stamp, 60)) {
      if (!stampGroups[stamp.name]) {
        stampGroups[stamp.name] = [];
      }
      stampGroups[stamp.name].push(stamp);
    }
  });

  return stampGroups;
}

function getSectionNearNode(sections: SectionNode[], sticky: StickyNode) {

  // let stampGroups: stampGroups = {};

  const sectionGroups: string[] = []

  sections.forEach(section => {
    if (isWithinProximity(section, sticky, 60)) {
      sectionGroups.push(section.name) 
    }
  });

  return sectionGroups[0] ? sectionGroups[0] : "";
}

export default function () {
  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin()
  });
  once<CopyToClipboardHandler>('COPY_TO_CLIPBOARD', function () {
    const stickyNodes: StickyNode[] = figma.currentPage.findAllWithCriteria({
      types: ['STICKY']
    })

    const stickies: StickyNote[] = [];

    // Find all stamps on the page
    const stampsNodes: StampNode[] = figma.currentPage.findAllWithCriteria({
      types: ['STAMP']
    })
    console.log(stampsNodes);

    // Find all stamps on the page
    const sectionsNodes: SectionNode[] = figma.currentPage.findAllWithCriteria({
      types: ['SECTION']
    })



    stickyNodes.forEach(sticky => {
      let stampVotes = getStampsNearNode(stampsNodes, sticky);
      
      let section = getSectionNearNode(sectionsNodes, sticky);
      // console.log("section: ", section);
      

      let votes = stampVotes["+1"]?.length;
      if (votes === undefined) {
        votes = 0;
      }
      const note: StickyNote = {
        content: sticky.name,
        author: sticky.authorName,
        // zone: sticky.parent?.name,
        zone: section,
        votes: votes
      }
      stickies.push(note);

    });


    figma.currentPage.selection = stickyNodes;
    figma.viewport.scrollAndZoomIntoView(stickyNodes);

    emit<TestHandler>('TEST_COPY', JSON.stringify(stickies))
  })
  showUI({
    height: 137,
    width: 240
  });
}
