// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WordpressService } from "../../services/WordpressService";
import { useCallback, useEffect, useState, Dispatch, SetStateAction } from "react";
import { WordpressPageDTO } from "../../../core/wordpress/dto/WordpressPageDTO";
import { LogService } from "../../../core/LogService";
import { WordpressReferenceDTO } from "../../../core/wordpress/dto/WordpressReferenceDTO";
import { WordpressUserProfileDTO } from "../../../core/wordpress/dto/WordpressUserProfileDTO";

const LOG = LogService.createLogger('useWordpressList');

export function useWordpressList():
    [
            readonly WordpressPageDTO[] | undefined,
            readonly WordpressReferenceDTO[] | undefined,
            readonly WordpressUserProfileDTO[] | undefined,

    ] {
    const [pageList, setPageList] = useState<readonly WordpressPageDTO[] | undefined>(undefined);
    const [referencesList, setReferenceLIst] = useState<readonly WordpressReferenceDTO[] | undefined>(undefined);
    const [userProfilesList, setUserProfilesList] = useState<readonly WordpressUserProfileDTO[] | undefined>(undefined);

    const getWordpressPagesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching pages list`);
                const result = await WordpressService.getMyWordpressPageList();
                LOG.debug(`Received pages list: `, result);
                setPageList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress page list: `, err);
            }
        },
        [
            setPageList
        ]
    );

    const getWordpressReferencesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching references list`);
                const result = await WordpressService.getWordpressReferenceList();
                LOG.debug(`Received references list: `, result);
                setReferenceLIst(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress references list: `, err);
            }
        },
        [
            setReferenceLIst
        ]
    );

    const getWordpressUserProfilesCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching user profiles list`);
                const result = await WordpressService.getWordpressUserProfilesList();
                LOG.debug(`Received user profiles list: `, result);
                setUserProfilesList(result);
            } catch (err) {
                LOG.error(`Failed to load wordpress user profiles list: `, err);
            }
        },
        [
            setUserProfilesList
        ]
    );

    // Update page list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            getWordpressPagesCallback()
        },
        [
            getWordpressPagesCallback
        ]
    );

    // Update reference list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            getWordpressReferencesCallback()
        },
        [
            getWordpressReferencesCallback
        ]
    );

    // Update reference list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            getWordpressUserProfilesCallback()
        },
        [
            getWordpressUserProfilesCallback
        ]
    );

    return [pageList, referencesList, userProfilesList];
}