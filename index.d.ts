export const console: any;
export function oco2Object(oco: any): {};
export function oco2Vars(oco: any, prefix?: string): string;
/**
 * Read source data from an array of paths and return a Reader instance.
 * @param  {string[]} pathArray An Array of paths to load.
 * @return {Reader} The Reader instance.
 */
export function paletteReader(pathArray: string[]): Reader;
/**
 * Write an Open Color format palette to the destination.
 * @param  {string} destination The destination path.
 * @param  {OpenColor} palette  The Open Color palette data.
 * @return {Promise} A promise that resoves when file is saved.
 */
export function paletteWriter(destination: string, palette: any): Promise<any>;
declare class Reader {
    constructor(source_: any);
    sourcePath: any;
    tree: any;
    pick(key_: any): any;
    /**
     * Transform the internal color palette to a range of additional formats.
     * @private
     * @param  {string[]} formats - An array of color formats to add to the palette.
     * @return {Reader} The Reader instance.
     */
    private transform;
    /**
     * Load palette data from an array of paths.
     * @private
     * @param  {string[]} pathArray The array of paths to load.
     * @return {Promise} A Promise that resolves with this instance when loaded.
     */
    private load;
    render(path: any): any;
}
export {};
