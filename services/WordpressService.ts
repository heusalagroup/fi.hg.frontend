import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";
import { WordpressClient } from "../../core/wordpress/WordpressClient"
import { WordpressPageDTO } from "../../core/wordpress/dto/WordpressPageDTO"
import { WordpressReferenceDTO } from "../../core/wordpress/dto/WordpressReferenceDTO";
import { WordpressUserProfileDTO } from "../../core/wordpress/dto/WordpressUserProfileDTO";
import {WordpressPostDTO} from "../../core/wordpress/dto/WordpressPostDTO";

export enum WordpressServiceEvent {
    WORDPRESS_PAGE_ADDED = "WordpressService:WordpressPageAdded",
    WORDPRESS_PAGE_REMOVED = "WordpressService:WordpressPageRemoved",
    WORDPRESS_PAGE_UPDATED = "WordpressService:WordpressPageUpdated",
    WORDPRESS_PAGE_CHANGED = "WordpressService:WordpressPageChanged"
}

export type WordpressServiceDestructor = ObserverDestructor;

const LOG = LogService.createLogger('WordpressService');

export class WordpressService {
    readonly _url:string;
    readonly _initialized:Promise<boolean>;
    constructor(url:string) {
        this._url = url;
        this._initialized = WordpressService.initialize(this._url);
    }

    private static _wordpressPage: WordpressPageDTO | undefined;
    private static _observer: Observer<WordpressServiceEvent> = new Observer<WordpressServiceEvent>("WordpressService");


    public static on(
        name: WordpressServiceEvent,
        callback: ObserverCallback<WordpressServiceEvent>
    ): WordpressServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy(): void {
        this._observer.destroy();
    }

    public static async initialize(url:string):Promise<boolean> {
        LOG.info(`Initializing`);
        const result = await this._initializeWordpress(url).catch((err) => {
            LOG.error(`ERROR: Could not initialize wordpress: `, err);
        });
        if (result) return true
        return false
    }

    public static async getWordpressPageList(url:string): Promise<readonly WordpressPageDTO[]> {
        if(!this.initialize) return []
        const client = WordpressClient.create(url);
        const result = await client.getPages();
        if (!result) {
            LOG.debug(`Couldn't get wordpress pages;`);
            return [];
        }
        return result;
    }

    public static async getWordpressPostList(url:string): Promise<readonly WordpressPostDTO[]> {
        if(!this.initialize) return []
        const client = WordpressClient.create(url);
        const result = await client.getPosts();
        if (!result) {
            LOG.debug(`Couldn't get wordpress posts;`);
            return [];
        }
        return result;
    }

    public static async getWordpressReferenceList(url:string): Promise<readonly WordpressReferenceDTO[]> {
        if(!this.initialize) return []
        const client = WordpressClient.create(url);
        const result = await client.getReferences();
        if (!result) {
            LOG.debug(`Couldn't get wordpress references;`);
            return [];
        }
        return result;
    }

    public static async getWordpressUserProfilesList(url:string): Promise<readonly WordpressUserProfileDTO[]> {
        if(!this.initialize) return []
        const client = WordpressClient.create(url);
        const result = await client.getUserProfiles();
        if (!result) {
            LOG.debug(`Couldn't get wordpress user profiles;`);
            return [];
        }
        return result;
    }

    public static setCurrentPage(wordpressPage: WordpressPageDTO | undefined) {
        if (wordpressPage !== this._wordpressPage) {
            this._wordpressPage = wordpressPage;
            if (this._observer.hasCallbacks(WordpressServiceEvent.WORDPRESS_PAGE_CHANGED)) {
                this._observer.triggerEvent(WordpressServiceEvent.WORDPRESS_PAGE_CHANGED);
            }
        }
    }

    private static async _initializeWordpress(url:string) {
        const list: readonly any[] = await WordpressService.getWordpressPageList(url);
        if ((list?.length ?? 0) !== 1) {
            LOG.info(`No wordpress pages;`);
            return false
        } else {
            LOG.info(`Selecting page: `, list[0]);
            WordpressService.setCurrentPage(list[0]);
            return true
        }
    }

}