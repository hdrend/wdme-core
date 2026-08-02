import { WDMENodeEvents } from "./WDMENodeEvents.js";
import { WDMEUUID, type WDMEUUIDType } from "../utils/WDMEUUID.js";
import type { WDMEEvent } from "../event/WDMEEvent.js";


export type WDMENodeConstructor = {
    new (...args: any[]): WDMENode;
    ClassName: string;
};

export class WDMENode {

    // Данные
    private readonly _id: WDMEUUIDType;
    public static readonly ClassName: string = "WDMENode";
    public Name: string;
    private _parent: WDMENode | null;
    private _attrib: Map<string, any>;
    private _children: WDMENode[];
    private _destroyed: boolean

    public readonly Events = new WDMENodeEvents();

    // Constructor.
    constructor(name: string, id?: WDMEUUIDType) {

        // генерируем уникальный идентификатор и заполняем данные.
        this._id = id ?? WDMEUUID.generate();
        this.Name = name;
        this._parent = null;
        this._attrib = new Map();
        this._children = [];
        this._destroyed = false;
    }

    // Public

    // WDMENode API
    // Add child to this node.
    // @param node: node to add to the children
    public AddChild(node: WDMENode) {

        if (this.IsDestroyed) return;

        // добавить ноду в текущую

        // проверка: нода - родитель текущей?
        if
        (
            this._parent === node ||

            // проверка: переданная нода текущая?
            node === this ||

            // проверка: текущая нода это потомок node?
            this.IsDescendantOf(node)
        ) return; // выходим
        
        // получить родителя
        const prnt = node._parent;

        // удаляем из родителя
        if(prnt !== null) prnt.RemoveChild(node);

        node._parent = this;
        node.Events.ParentChanged.Emit(this);

        this._children.push(node);

        // событие
        this.Events.ChildAdded.Emit(node);
    }

    // WDMENode API
    // Remove child from this node.
    // @param node: node to remove from the children
    // @return true if ok, false if not
    public RemoveChild(node: WDMENode): boolean {

        if (this.IsDestroyed) return false;

        // удаляем ноду из детей текущей.
        const idx = this._children.indexOf(node);

        // проверка что нода есть
        if (idx !== -1) {

            // удаляем ее.
            node._parent = null;
            node.Events.ParentChanged.Emit(null);

            this._children.splice(idx, 1);

            // событие
            this.Events.ChildRemoved.Emit(node);
            return true;
        }

        // не найдена
        return false;
    }

    // WDMENode API
    // Get list of children of this node.
    // @return new list of children
    public GetChildren(): WDMENode[] {

        // возвращаем новый список
        return [...this._children];
    }

    // WDMENode API
    // Get first child by name.
    // @param name: name of child
    // @return WDMENode | null: if found - WDMENode, if not - null.
    public FindFirstChild(name: string): WDMENode | null {

        // находим ребенка с таким же именем.
        for(const node of this.GetChildren()) {
            if(node.IsDestroyed === false && node.Name == name) {
                return node;
            }
        }
        
        // не нашли / нода удалена
        return null;
    }

    // WDMENode API
    // Get first child by type.
    // @param name: name of child
    // @return WDMENode | null: if found - WDMENode, if not - null.
    public FindFirstChildOfType<T extends WDMENode>(type: new (...args: any[]) => T): T | null {

        // находим ребенка с таким же типом
        for(const node of this.GetChildren()) {
            if(node.IsDestroyed === false && node instanceof type) {
                return node;
            }
        }
        
        // не нашли / нода удалена
        return null;
    }

    // WDMENode API
    // Find child by its ID
    // @param id: uuid of node
    // @return WDMENode | null
    public FindChildById(id: WDMEUUIDType): WDMENode | null {

        // находим ребенка с таким же идентификатором.
        for(const node of this.GetChildren()) {
            if(node.IsDestroyed === false && node._id == id) {
                return node;
            }
        }
        
        // не нашли / нода удалена
        return null;
    }

    // WDMENode API
    // Destroys the node and its children.
    public Destroy() {
        // выходим если нода уже удалена
        if (this.IsDestroyed) return;

        this.Events.Destroying.Emit();

        // удаляем всех детей если они есть
        if (this._children.length !== 0) {
            for(const node of this.GetChildren()) {
                node.Destroy()
            }
        }

        // удаляем из детей родителя если родитель есть
        if (this.Parent !== null) {

            // в целом можно было и просто this.Parent = null, но так красивее.
            const prnt = this.Parent
            prnt.RemoveChild(this);
        }

        // удаляем аттрибуты
        for(const attribName of this.GetAttributes().keys()) {
            this.RemoveAttribute(attribName);
        }

        // вызываем событие и помечаем как удаленная 
        this._destroyed = true;
        this.Events.Destroyed.Emit();

        // удаляем ивенты (тут так как Destroyed никому бы не пришел)
        for(const exactEvent of Object.values(this.Events) as WDMEEvent[]) {
            exactEvent.DisconnectAll();
        }
    }

    // WDMENode API
    // Check - this node is descendant of another
    // @param node: ancestor
    // @return boolean: if yes - true, if not - false
    public IsDescendantOf(node: WDMENode | null): boolean {

        if (this.IsDestroyed) return false;
        if(node === null) return false; // без раздумий

        // текущий родитель
        let current = this.Parent;

        // пока текущий родитель не null, идем вверх
        while (current !== null) {
    
            // возвращает true если текущая нода равна искомой 
            if (current === node) return true;
    
            // делаем текущего родителя прародителем
            current = current.Parent;
        }
    
        // не нашли
        return false;
    }

    // WDMENode API
    // Get all descendants of this node
    // @return WDMENode[]: list of all descendants
    public GetDescendants(): WDMENode[] {

        // список потомков
        const descendants: WDMENode[] = [];

        // добавляем потомков рекурсивно
        for (const child of this.GetChildren()) {
            descendants.push(child);
            descendants.push(...child.GetDescendants());
        }

        return descendants;
    }

    // WDMENode API
    // Get all descendants of this node
    // @return WDMENode[]: list of all descendants
    public GetDescendantsOfType<T extends WDMENode>(type: new (...args: any[]) => T): T[] {

        // список потомков
        const descendants: T[] = [];

        // добавляем потомков рекурсивно + проверям что они нужного типа
        for (const child of this.GetChildren()) {
            if (child instanceof type) descendants.push(child);

            descendants.push(...child.GetDescendantsOfType(type));
        }

        return descendants;
    }

    // WDMENode API
    // Get all descendants of this node
    // @return WDMENode[]: list of all descendants
    public GetChildrenOfType<T extends WDMENode>(type: new (...args: any[]) => T): T[] {

        // список потомков
        const children: T[] = [];

        // добавляем детей рекурсивно
        for (const child of this.GetChildren()) {
            if (child instanceof type) {
                children.push(child);
            }
        }

        return children;
    }

    // WDMENode API
    // Find first descendant by name
    // @param name: name of descendant
    // @return WDMENode | null: if found - WDMENode, if not - null.
    public FindFirstDescendant(name: string): WDMENode | null {

        // проходимя по потомкам
        for(const child of this.GetDescendants()) {
            if(child.Name == name) {

                // нашли
                return child
            }
        }
        
        // не нашли
        return null;
    }

        // WDMENode API
    // Get first child by type.
    // @param name: name of child
    // @return WDMENode | null: if found - WDMENode, if not - null.
    public FindFirstDescendantOfType<T extends WDMENode>(type: new (...args: any[]) => T): T | null {

        // находим потомка с таким же типом
        for(const node of this.GetDescendants()) {
            if(node.IsDestroyed === false && node instanceof type) {
                return node;
            }
        }
        
        // не нашли / нода удалена
        return null;
    }

    // WDMENode API
    // WDMENode Destroyed state.
    // @return boolean
    public get IsDestroyed(): boolean {
        return this._destroyed
    }
    
    // WDMENode API
    // Set node's parent
    set Parent(node) {

        // если null - удалить, иначе добавить
        if (node === null) {
            this._parent?.RemoveChild(this);
            this.Events.ParentChanged.Emit(null);
            return;
        }

        // добавляем
        node.AddChild(this);
        this.Events.ParentChanged.Emit(node);
    }

    // WDMENode API
    // Get node's parent.
    public get Parent() {
        return this._parent;
    }

    // WDMENode API
    // Get node's id.
    public get Id() {
        return this._id;
    }

    // WDMENode API
    // Get node's class name.
    public get ClassName(): string {
        return (this.constructor as WDMENodeConstructor).ClassName;
    }

    // Attribute API
    // Adds attribute to this node
    // @param name: name of attribute
    // @param value: value of attribute
    public SetAttribute(name: string, value: any) {

        if(this.IsDestroyed) return;

        // записываем аттрибут
        this._attrib.set(name, value);
    }

    // Attribute API
    // Get all attributes in this node
    // @return Map<string, any>
    public GetAttributes(): Map<string, any> {
        return new Map(this._attrib);
    }

    // Attribute API
    // Removes attribute from this node
    // @param name: name of attribute
    // @return boolean: if deleted - true, if not - false
    public RemoveAttribute(name: string): boolean {

        if(this.IsDestroyed) return false;

        // убираем аттрибут
        return this._attrib.delete(name);
    }

    // Attribute API
    // Get value of attribute
    // @param name: name of attribute
    // @return any | undefined: attribute value
    public GetAttribute(name: string): any {

        // возвращает значение аттрибута
        return this._attrib.get(name);
    }

    // Attribute API
    // Has this node given attribute's name
    // @param name: name of attribute
    // @return boolean
    public HasAttribute(name: string): boolean {

        // возвращает значение аттрибута
        return this._attrib.has(name);
    }
}