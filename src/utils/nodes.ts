import { stampGroups } from "../types";

/**
 * Check if two nodes are near each other
 * @param {SceneNode} node1
 * @param {SceneNode} node2
 * @returns {boolean}
 */
const isWithinProximity = (
  node1: SceneNode,
  node2: SceneNode,
  tolerance = 40
) => {
  let node1Center = {
    x: node1.absoluteBoundingBox!.x + node1.width / 2,
    y: node1.absoluteBoundingBox!.y + node1.height / 2,
  };
  let node2Center = {
    x: node2.absoluteBoundingBox!.x + node2.width / 2,
    y: node2.absoluteBoundingBox!.y + node2.height / 2,
  };
  let proximityWidth = node1.width / 2 + tolerance;
  let proximityHeight = node1.height / 2 + tolerance;

  return (
    Math.abs(node1Center.x - node2Center.x) <= proximityWidth &&
    Math.abs(node1Center.y - node2Center.y) <= proximityHeight
  );
};

/**
 * Return all stamps near a sticky
 * @param {StampNode[]} stamps
 * @param {StickyNode} sticky
 * @returns {stampGroups}
 */
export const getStampsNearNode = (stamps: StampNode[], sticky: StickyNode) => {
  let stampGroups: stampGroups = {};

  stamps.forEach((stamp) => {
    if (isWithinProximity(sticky, stamp, 60)) {
      if (!stampGroups[stamp.name]) {
        stampGroups[stamp.name] = [];
      }
      stampGroups[stamp.name].push(stamp);
    }
  });

  return stampGroups;
};

/**
 * Get the section name of a sticky
 * @param {SectionNode[]} sections
 * @param {StickyNode} sticky
 * @returns {string}
 */
export const getSectionNearNode = (
  sections: SectionNode[],
  sticky: StickyNode
) => {
  const sectionGroups: string[] = [];

  sections.forEach((section) => {
    if (isWithinProximity(section, sticky, 60)) {
      sectionGroups.push(section.name);
    }
  });

  return sectionGroups[0] ? sectionGroups[0] : "";
};
