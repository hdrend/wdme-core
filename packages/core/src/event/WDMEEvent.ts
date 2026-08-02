import { WDMEEventConnection } from "./WDMEEventConnection.js";

export class WDMEEvent {
    private _connections: WDMEEventConnection[];

    constructor() {
        this._connections = [];
    }

    // Connect to event
    // @param callback: a function called when an event emitted
    public Connect(callback: (...args: any[]) => void): WDMEEventConnection {
        return this._connect(false, callback);
    }

    // Connect to event once
    // @param callback: a function called when an event emitted
    public Once(callback: (...args: any[]) => void): WDMEEventConnection {
        return this._connect(true, callback);
    }

    // Emit event
    public Emit(...args: any[]) {

        // проходимся по всем соединиеням и вызываем их
        for(const connection of [...this._connections]) {

            // не уверен что понадобится но пусть будет.
            if(connection.IsConnected) {

                // вызываем соединение
                connection.Invoke(...args);
                
                // смотрим - если соединение одноразовое то отключаемся и убираем соединение из списка соединений.
                if(connection.IsOnce) {
                    this._disconnect(connection);
                }
            }
        }
    }

    // Disconnect from all connections
    public DisconnectAll() {

        // проходимся по списку соединений и отключаемся от них
        for (const connection of [...this._connections]) {
            this._disconnect(connection);
        }
    }

    // internal: connect
    private _connect(once: boolean, callback: (...args: any[]) => void) {
        const connection = new WDMEEventConnection(once, callback)
        this._connections.push(connection);
        return connection;
    }

    // internal: disconnect from event
    private _disconnect(con: WDMEEventConnection) {

        // отключаемся от соединения
        con.Disconnect()

        // индекс
        const idx = this._connections.indexOf(con);

        if (idx !== -1) {
            this._connections.splice(idx, 1);
        }
    }
}