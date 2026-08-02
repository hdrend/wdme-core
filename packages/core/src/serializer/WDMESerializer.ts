import type { WDMENode } from "../node/WDMENode.js";
import { WDMENodeRegistry } from "../node/WDMENodeRegistry.js";
import { WDMEProject } from "../node/WDMEProject.js";
import type { WDMEUUIDType } from "../utils/WDMEUUID.js";
import { WDMEConfig } from "../utils/WDMEConfig.js";
import type { ISWDMENode } from "./ISWDMENode.js";
import type { ISWDMEProject } from "./ISWDMEProject.js";

export class WDMESerializer {

    constructor(private _registry: WDMENodeRegistry) {}
    
    public Serialize(project: WDMEProject): string {
        const nodes: ISWDMENode[] = [];

        // вставляем сам проект
        nodes.push(this.SerializeNode(project))

        // проходимя по потомкам
        for (const child of project.GetDescendants()) {
            nodes.push(this.SerializeNode(child))
        }

        // конвертируем
        const wdme = {
            "version": WDMEConfig.version,
            "root": project.Id,
            "nodes": nodes,
        }

        // возвращаем готовый проект
        return JSON.stringify(wdme);
    };

    public Deserialize(data: string): WDMEProject | undefined {

        // парсим
        const projectData: ISWDMEProject = JSON.parse(data);

        // проверка что версия меньше или равна текущей актуальной
        if(projectData.version <= WDMEConfig.formatVersion) {

            // временные ноды
            const nodes = new Map<WDMEUUIDType, WDMENode>();

            // проходимся по нодам
            for(const nodeData of projectData.nodes) {

                // получили класс ноды из ее типа в данных проекта
                const klass = this._registry.GetClass(nodeData.type);

                // проверка что класс есть
                if(!klass) throw new Error(`Unknown node type '${nodeData.type}'`);

                // создаем экземпляр ноды
                const node = new klass(
                    nodeData.name,
                    nodeData.id
                );

                // восстанавливаем аттрибуты
                for (const [key, value] of Object.entries(nodeData.attributes)) {
                   node.SetAttribute(key, value);
                }

                // кладем в мапу информацию о идентификаторе ноды и самой ноде
                nodes.set(node.Id, node);
            }

            // восстановление родителей
            for (const nodeData of projectData.nodes) {
                if(nodeData.parentId !== null) {

                    // получаем ноду
                    const node = nodes.get(nodeData.id);
                    if (!node) throw new Error(`Node '${nodeData.id}' not found.`);

                    // получаем родителя из мапы
                    const parent = nodes.get(nodeData.parentId);
                    if (!parent) throw new Error(`Parent '${nodeData.parentId}' not found for node '${nodeData.id}'.`);

                    parent.AddChild(node);
                }
                continue
            }

            // возвращаем
            const project = nodes.get(projectData.root);

            if (!(project instanceof WDMEProject)) throw new Error("Root is not WDMEProject.");

            return project;
        }

        throw new Error("Version of project is not supported");
    };

    private SerializeNode(node: WDMENode): ISWDMENode {

        // данные сериализации
        const data: ISWDMENode = {
            type: node.ClassName,
            id: node.Id,
            parentId: node.Parent?.Id ?? null,
            name: node.Name,
            attributes: {}
        } 

        // добавляем аттрибуты
        for (const [key, value] of node.GetAttributes()) {
        	data.attributes[key] = value;
        }
        
        return data
    }

}