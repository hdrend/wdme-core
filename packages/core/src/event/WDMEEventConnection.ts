export class WDMEEventConnection {
    private callback: (...args: any[]) => void;
    private once: boolean;
    private connected: boolean;

    constructor(once: boolean, callback: (...args: any[]) => void) {
        this.callback = callback;
        this.once = once;
        this.connected = true
    }

    // Disconnect from connection.
    public Disconnect() {
        this.connected = false;
    }

    // Invoke the callback
    public Invoke(...args: any[]) {
        this.callback(...args);
    }

    // Check - connection is active
    // @return boolean
    public get IsConnected(): boolean {
        return this.connected;
    }

    // Check - connection is once
    // @return boolean
    public get IsOnce(): boolean {
        return this.once;
    }
}