import type { WDMECoreAPI } from "../WDMECoreAPI.js";

export interface IWDMEPlugin {

    // имя
    Name: string;

    // функция, в которую передается WDME Core API, ее вызывает WDMEPluginLoader
    Initialize(api: WDMECoreAPI): void;

    // функция, в которую передается WDME Core API, ее вызывает WDMEPluginLoader и она убирает все данные и код плагина из ядра
    Shutdown?(api: WDMECoreAPI): void;

}