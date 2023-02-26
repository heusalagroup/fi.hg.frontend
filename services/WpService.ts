// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Observer, ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { LogService } from "../../core/LogService";
import { WpClient } from "../../core/wordpress/WpClient"
import { WpPageDTO } from "../../core/wordpress/dto/WpPageDTO"
import { WpReferenceDTO } from "../../core/wordpress/dto/WpReferenceDTO";
import { WpUserProfileDTO } from "../../core/wordpress/dto/WpUserProfileDTO";
import { WpPostDTO } from "../../core/wordpress/dto/WpPostDTO";
import { WpUserProfileListDTO } from "../../core/wordpress/dto/WpUserProfileListDTO";

export enum WpServiceEvent {
    WP_PAGE_ADDED = "WpServiceEvent:WpPageAdded",
    WP_PAGE_REMOVED = "WpServiceEvent:WpPageRemoved",
    WP_PAGE_UPDATED = "WpServiceEvent:WpPageUpdated",
    WP_PAGE_CHANGED = "WpServiceEvent:WpPageChanged"
}

export type WpServiceDestructor = ObserverDestructor;

const LOG = LogService.createLogger('WpService');

export class WpService {
    readonly _url:string;
    readonly _initialized:Promise<boolean>;
    constructor(url:string) {
        this._url = url;
        this._initialized = WpService.initialize(this._url);
    }

    private static _wordpressPage: WpPageDTO | undefined;
    private static _observer: Observer<WpServiceEvent> = new Observer<WpServiceEvent>("WpService");


    public static on(
        name: WpServiceEvent,
        callback: ObserverCallback<WpServiceEvent>
    ): WpServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy(): void {
        this._observer.destroy();
    }

    public static async initialize (url:string): Promise<boolean> {
        LOG.info(`Initializing`);
        const result = await this._initializeWordpress(url).catch((err) => {
            LOG.error(`ERROR: Could not initialize wordpress: `, err);
        });
        if (result) return true;
        return false
    }

    public static async getWpPageList (url:string): Promise<readonly WpPageDTO[]> {
        if(!this.initialize) return []
        const client = WpClient.create(url);
        const result = await client.getPages();
        if (!result) {
            LOG.debug(`Couldn't get wordpress pages;`);
            return [];
        }
        return result;
    }

    public static async getWpPostList (url:string): Promise<readonly WpPostDTO[]> {
        if(!this.initialize) return []
        const client = WpClient.create(url);
        const result = await client.getPosts();
        if (!result) {
            LOG.debug(`Couldn't get wordpress posts;`);
            return [];
        }
        return result;
    }

    public static async getWpReferenceList (url:string): Promise<readonly WpReferenceDTO[]> {
        if(!this.initialize) return []
        const client = WpClient.create(url);
        const result = await client.getReferences();
        if (!result) {
            LOG.debug(`Couldn't get wordpress references;`);
            return [];
        }
        return result;
    }

    public static async getWpUserProfileList (url:string): Promise<readonly WpUserProfileDTO[]> {
        if(!this.initialize) return []
        const client = WpClient.create(url);
        const result : WpUserProfileListDTO = await client.getUserProfiles();
        if (!result) {
            LOG.debug(`Couldn't get wordpress user profiles;`);
            return [];
        }
        return result;
    }

    public static setCurrentPage (wordpressPage: WpPageDTO | undefined) {
        if (wordpressPage !== this._wordpressPage) {
            this._wordpressPage = wordpressPage;
            if (this._observer.hasCallbacks(WpServiceEvent.WP_PAGE_CHANGED)) {
                this._observer.triggerEvent(WpServiceEvent.WP_PAGE_CHANGED);
            }
        }
    }

    private static async _initializeWordpress (url:string) {
        const list: readonly any[] = await WpService.getWpPageList(url);
        if ((list?.length ?? 0) !== 1) {
            LOG.info(`No wordpress pages;`);
            return false
        } else {
            LOG.info(`Selecting page: `, list[0]);
            WpService.setCurrentPage(list[0]);
            return true
        }
    }

}