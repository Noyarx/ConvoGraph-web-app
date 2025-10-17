import { Volume } from 'memfs'
import type * as fsa from 'memfs/lib/fsa/types';
import { FsaNodeFs } from 'memfs/lib/fsa-to-node'
import { ufs } from 'unionfs'
import type { IDirent } from 'memfs/lib/node/types/misc';

export interface ListItem {
    path: string;
    label: string;
    kind: 'directory' | 'file';
    child?: ListItem[];
}

export class PersisterService {
    private static instance: PersisterService

    private actions: { [key: string]: (...args: any[]) => Promise<any> } = {}

    static getInstance(): PersisterService {
        if (!PersisterService.instance) {
            PersisterService.instance = new PersisterService()
        }
        return PersisterService.instance
    }
    private static readonly ROOT_PATH = '/ConvoGraph';

    private _isInitialized = false

    public get isInitialized() {
        return this._isInitialized
    }

    public init = async () => {
        console.log('File System Access API is not available. Using in-memory file system.')
        const dir = await navigator.storage.getDirectory() as unknown as Promise<fsa.IFileSystemDirectoryHandle>;
        const opfs = (window as any).fs = new FsaNodeFs(dir);
        ufs.use(opfs);

        // const memoryFs = Volume.fromJSON({}, PersisterService.ROOT_PATH);
        // ufs.use(memoryFs);
        (window as any).ufs = ufs;
        this.actions = ufs.promises;
        this._isInitialized = true;
        console.group('PersisterService initialized with the following file systems:');
        console.log('OPFS-based FS:', opfs.promises);
        // console.log('In-memory FS:', memoryFs.promises);
        console.log("UFS:", ufs.promises);
        console.log("Actions: ", this.actions);
        await this.actions.mkdir(PersisterService.ROOT_PATH).catch(() => { });
        console.groupEnd();
    }

    // Wrap FSA methods
    public readFile = async (path: string): Promise<string> => {
        if (!path.startsWith(PersisterService.ROOT_PATH)) {
            path = `${PersisterService.ROOT_PATH}/${path}`;
        }
        return (await this.actions.readFile(path)).toString();
    }
    public writeFile = async (path: string, data: string): Promise<void> => {
        if (!path.startsWith(PersisterService.ROOT_PATH)) {
            path = `${PersisterService.ROOT_PATH}/${path}`;
        }
        return this.actions.writeFile(path, data);
    }

    public readdir = async (path?: string): Promise<ListItem[]> => {
        if (!path) path = PersisterService.ROOT_PATH;
        if (!path.startsWith(PersisterService.ROOT_PATH)) {
            path = `${PersisterService.ROOT_PATH}/${path}`;
        }
        // trim ending slash for consistency
        path = path.replace(/\/+$/, '');
        console.debug("Reading directory:", path);
        const ls = await this.actions.readdir(path) as string[];
        const items = await Promise.all(ls.map(async name => {
            console.debug('Stat for', name);
            const stat = await this.actions.stat(`${path}/${name}`);
            const kind = stat.kind as 'directory' | 'file';
            if (stat.kind === 'directory') {
                const childItems = await this.readdir(`${path}/${name}`);
                return { path: name, label: name, kind, child: childItems };
            }
            return { path: name, label: name, kind };
        }));
        return items;
    }

    public mkdir = async (path: string): Promise<void> => {
        if (!path.startsWith(PersisterService.ROOT_PATH)) {
            path = `${PersisterService.ROOT_PATH}/${path}`;
        }
        await this.actions.mkdir(path);
    }


}

PersisterService.getInstance().init();