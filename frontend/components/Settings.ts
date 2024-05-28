import { Millennium, pluginSelf } from "millennium-lib"
import { SettingsProps } from "./types"

export let SettingsStore: SettingsProps = pluginSelf.SettingsStore

export const Settings = {

    FetchAllSettings: () => {
        return new Promise<SettingsProps>(async (resolve: any, _reject: any) => {

            const settingsStore: SettingsProps = JSON.parse(await Millennium.callServerMethod("get_load_config"))

            SettingsStore = settingsStore
            resolve(settingsStore)
        })
    }
}