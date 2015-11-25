/**
 * Sample filter
 */
export function pluginTypeFilter(): Function {
    return (plugins: Array<any>, filterObject: any) => {
            return plugins;
    };
}
