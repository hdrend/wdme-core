import { WDMEFolder } from "./node/WDMEFolder.js";
import type { WDMENode } from "./node/WDMENode.js";
import { WDMENodeRegistry } from "./node/WDMENodeRegistry.js";
import { WDMEProject } from "./node/WDMEProject.js";
import type { IWDMEPlugin } from "./plugin/IWDMEPlugin.js";
import { WDMESerializer } from "./serializer/WDMESerializer.js";
import { WDMEConfig } from "./utils/WDMEConfig.js";

export class WDMECoreAPI {

    private registry = new WDMENodeRegistry();
    private serializer = new WDMESerializer(this.registry);

    constructor() {
        this.RegisterNode(WDMEProject);
        this.RegisterNode(WDMEFolder);
    }

    // Core API
    // Register new node type.
    // @param klass: constructor of your node
    public RegisterNode<T extends typeof WDMENode>(klass: T) {
        this.registry.Register(klass);
    }

    // Core API
    // Unegister node type.
    // @param name: name of type
    // @return boolean: true - unregistered, false - not
    public UnregisterNode<T extends typeof WDMENode>(klass: T): boolean {
        return this.registry.Unregister(klass);
    }

    // Core API
    // Get node class by it name.
    // @param name: name of class
    // @return WDMENode class | null
    public GetNodeClass(name: string): (new (...args: any[]) => WDMENode) | null {
        return this.registry.GetClass(name);
    }

    // Core API
    // Check for a node class
    // @param name: name of class
    // @return boolean
    public HasNodeClass(name: string): boolean {
        return this.registry.HasClass(name);
    }

    // Core API
    // Serialize project to .wdme format
    // @param project: project to serialize
    // @return string: serialized WDMEProject
    public Serialize(project: WDMEProject): string {
        return this.serializer.Serialize(project);
    }

    // Core API
    // Deserialize project from .wdme to WDMEProject
    // @param serialized: serealized version of project
    // @return WDMEProject | undefined: deserialized .wdme
    public Deserialize(serialized: string): WDMEProject | undefined {
        return this.serializer.Deserialize(serialized);
    }

    // Core API
    // Load plugin
    public LoadPlugin(plugin: IWDMEPlugin) {
        plugin.Initialize(this);
    }

    // Core API
    // Unoad plugin
    public UnoadPlugin(plugin: IWDMEPlugin) {
        plugin.Shutdown?.(this);
    }

    // Core API
    // Get actual version of WDMECore
    // @return string (like 2026.3a)
    public get Version(): string {
        return WDMEConfig.version;
    }
}