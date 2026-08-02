export type WDMEUUIDType = string;
export class WDMEUUID {
    static generate(): WDMEUUIDType {
        return crypto.randomUUID().toString();
    }
}