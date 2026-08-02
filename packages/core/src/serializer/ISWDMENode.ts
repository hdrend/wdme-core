export interface ISWDMENode {

    type: string;
    id: string;
    name: string;

    attributes: Record<string, any>;

    parentId: string | null;

}