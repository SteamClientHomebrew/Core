export interface Plugin {
    common_name?: string, 
    name: string,
    description?: string,
    venv?: string
}

export interface PluginComponent {
    path: string,
    enabled: boolean,
    data: Plugin
}