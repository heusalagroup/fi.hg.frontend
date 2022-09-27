import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";
import { WordpressClient } from "../../core/wordpress/WordpressClient"
import {  WordpressPageDTO } from "../../core/wordpress/dto/WordpressPageDTO"
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
    url:string;
    endpoint:string;
    constructor(url?, endpoint?) {
        this.url = url;
        this.endpoint = endpoint;
    }

    private static _wordpressPage: WordpressPageDTO | undefined;
    private static _wordpressReferences: WordpressReferenceDTO | undefined;
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

    public static async getWordpressContent(url?, endpoint?): Promise<any>{
        const client = new WordpressClient(url, endpoint); // FIXME: Save client somewhere in a service as reusable
        const result = await client.getWordpressContent();
        if (!result) {
            LOG.debug(`Couldn't get wordpress content;`);
            return;
        }
        return await client.getWordpressContent();
    }

    public static async getWordpressPageList(url?, endpoint?): Promise<readonly WordpressPageDTO[]> {
        const client = new WordpressClient(url, endpoint); // FIXME: Save client somewhere in a service as reusable
        const result = await client.getPages();
        if (!result) {
            LOG.debug(`Couldn't get wordpress pages;`);
            return [];
        }
        return await client.getPages();
    }

    public static async getWordpressReferenceList(url?, endpoint?): Promise<readonly WordpressReferenceDTO[]> {
        const client = new WordpressClient(url, endpoint); // FIXME: Save client somewhere in a service as reusable
        const result = await client.getReferences();
        if (!result) {
            LOG.debug(`Couldn't get wordpress references;`);
            return [];
        }
        return await client.getReferences();
    }

    public static async getWordpressUserProfilesList(url?, endpoint?): Promise<readonly WordpressUserProfileDTO[]> {
        const client = new WordpressClient(url, endpoint); // FIXME: Save client somewhere in a service as reusable
        const result = await client.getUserProfiles();
        if (!result) {
            LOG.debug(`Couldn't get wordpress user profiles;`);
            return [];
        }
        return await client.getUserProfiles();
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
        const list: readonly any[] = await WordpressService.getWordpressContent();
        if ((list?.length ?? 0) !== 1) {
            LOG.info(`No wordpress pages;`);
        } else {
            LOG.info(`Selecting page: `, list[0]);
            WordpressService.setCurrentPage(list[0]);
        }
    }

}