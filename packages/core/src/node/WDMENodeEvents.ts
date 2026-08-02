import { WDMEEvent } from "../event/WDMEEvent.js";

export class WDMENodeEvents {
    
    public ChildAdded = new WDMEEvent();
    public ChildRemoved = new WDMEEvent();
    public ParentChanged = new WDMEEvent();
    public Destroying = new WDMEEvent();
    public Destroyed = new WDMEEvent();
    public PropertyChanged = new WDMEEvent();

}