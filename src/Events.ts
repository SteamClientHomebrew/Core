import { Millennium } from "@millennium/ui"

export const WatchDog = {
    startReload: () => {
        SteamClient.Browser.RestartJSContext();
    },

    startRestart: () => {
        SteamClient.User.StartRestart(false);
    }
}