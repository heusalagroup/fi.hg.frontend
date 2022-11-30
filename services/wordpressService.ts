import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";
import { WordpressClient } from "../../core/wordpress/WordpressClient"
import { WordpressPageDTO } from "../../core/wordpress/dto/WordpressPageDTO"
import { WordpressReferenceDTO } from "../../core/wordpress/dto/WordpressReferenceDTO";
import { WordpressUserProfileDTO } from "../../core/wordpress/dto/WordpressUserProfileDTO";

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
    constructor(url?) {
        this._url = url;
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

    public static initialize() {
        LOG.info(`Initializing`);
        this._initializeWordpress().catch((err) => {
            LOG.error(`ERROR: Could not initialize wordpress: `, err);
        });
    }

    public static async getWordpressPageList(url?): Promise<readonly WordpressPageDTO[]> {
        const client = WordpressClient.create(url);
        const result = await client.getPages();
        if (!result) {
            LOG.debug(`Couldn't get wordpress pages;`);
            return [];
        }
        return result;
    }

    public static async getWordpressReferenceList(url?): Promise<readonly WordpressReferenceDTO[]> {
        const client = WordpressClient.create(url);
        const result = await client.getReferences();
        if (!result) {
            LOG.debug(`Couldn't get wordpress references;`);
            return [];
        }
        return result;
    }

    public static async getWordpressUserProfilesList(url?): Promise<readonly WordpressUserProfileDTO[]> {
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

    private static async _initializeWordpress() {
        const list: readonly any[] = await WordpressService.getWordpressPageList();
        if ((list?.length ?? 0) !== 1) {
            LOG.info(`No wordpress pages;`);
        } else {
            LOG.info(`Selecting page: `, list[0]);
            WordpressService.setCurrentPage(list[0]);
        }
    }

}