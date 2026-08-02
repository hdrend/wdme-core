import type { WDMENode } from "./WDMENode.js";

export class WDMENodeRegistry {
    private _registered: Map<string, new (...args: any[]) => WDMENode> = new Map();

    // Register WDMENode type.
    public Register<T extends typeof WDMENode>(klass: T) {
        if (this._registered.has(klass.ClassName)) throw new Error("Duplicate: " + klass.ClassName);
        this._registered.set(klass.ClassName, klass);
    }
    
    // Unregister WDMENode type.
    // @return boolean: true if deleted, false if not
    public Unregister<T extends typeof WDMENode>(klass: T): boolean {
        return this._registered.delete(klass.ClassName);
    }

    // Get WDMENode type
    // @return (new (...args: any[]) => WDMENode) | undefined
    public GetClass(name: string): (new (...args: any[]) => WDMENode) | null {
        return this._registered.get(name) || null;
    }

    // Has registry given WDMENode type
    // @return boolean
    public HasClass(name: string): boolean {
        return this._registered.has(name);
    }
}