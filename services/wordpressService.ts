import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";
import { WordpressClient } from "../../core/wordpress/WordpressClient"
import { isWordpressPageDTO, WordpressPageDTO } from "../../core/wordpress/dto/WordpressPageDTO"
import { isWordpressPagesDTO, WordpressPageListDTO } from "../../core/wordpress/dto/WordpressPageListDTO"
import { HgFrontend } from "../HgFrontend";
import { WordpressReferenceDTO } from "../../core/wordpress/dto/WordpressReferenceDTO";
import { WordpressUserProfileDTO } from "../../core/wordpress/dto/WordpressUserProfileDTO";

HgFrontend.initialize(); // FIXME: Wasn't certain where this should be placed, but Im certain it needs to be fixed!

export enum WordpressServiceEvent {
    WORDPRESS_PAGE_ADDED = "WordpressService:WordpressPageAdded",
    WORDPRESS_PAGE_REMOVED = "WordpressService:WordpressPageRemoved",
    WORDPRESS_PAGE_UPDATED = "WordpressService:WordpressPageUpdated",
    WORDPRESS_PAGE_CHANGED = "WordpressService:WordpressPageChanged"
}

export type WordpressServiceDestructor = ObserverDestructor;

const LOG = LogService.createLogger('WordpressService');

export class WordpressService {

    private static _wordpressPage: WordpressPageDTO | undefined;
    private static _wordpressReferences: WordpressReferenceDTO | undefined;
    private static _observer: Observer<WordpressServiceEvent> = new Observer<WordpressServiceEvent>("WordpressService");

    public static getCurrentWordpressPageId(): string | undefined {
        return this._wordpressPage?.id;
    }

    public static getCurrentWordpressTitle(): object | undefined {
        return this._wordpressPage?.title;
    }

    public static getWordpressPage(): WordpressPageDTO | undefined {
        if (isWordpressPageDTO(this._wordpressPage))
            return this._wordpressPage;
    }

    public static async getWordpressPages(): Promise<WordpressPageListDTO | undefined> {
        if (isWordpressPagesDTO(this._wordpressPage))
            return this._wordpressPage;
    }

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

    public static async getMyWordpressPageList(): Promise<readonly WordpressPageDTO[]> {
        const client = new WordpressClient('https://cms.hg.fi'); // FIXME: Save client somewhere in a service as reusable
        const result = await client.getPages();
        if (!result) {
            LOG.debug(`Couldn't get wordpress pages;`);
            return [];
        }
        return await client.getPages();
    }

    public static async getWordpressReferenceList(): Promise<readonly WordpressReferenceDTO[]> {
        const client = new WordpressClient('https://cms.hg.fi'); // FIXME: Save client somewhere in a service as reusable
        const result = await client.getReferences();
        if (!result) {
            LOG.debug(`Couldn't get wordpress references;`);
            return [];
        }
        return await client.getReferences();
    }

    public static async getWordpressUserProfilesList(): Promise<readonly WordpressUserProfileDTO[]> {
        const client = new WordpressClient('https://cms.hg.fi'); // FIXME: Save client somewhere in a service as reusable
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
        const list: readonly WordpressPageDTO[] = await WordpressService.getMyWordpressPageList();
        if ((list?.length ?? 0) !== 1) {
            LOG.info(`No wordpress pages;`);
        } else {
            LOG.info(`Selecting page: `, list[0]);
            WordpressService.setCurrentPage(list[0]);
        }
    }

}