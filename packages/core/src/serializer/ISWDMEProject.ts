import type { WDMEUUIDType } from "../utils/WDMEUUID.js";
import type { ISWDMENode } from "./ISWDMENode.js";

export interface ISWDMEProject {
    version: number;
    root: WDMEUUIDType;
    nodes: ISWDMENode[];
}