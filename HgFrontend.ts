// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { RequestClientInterface } from "../core/requestClient/RequestClientInterface";
import { WindowObjectService } from "../core/WindowObjectService";
import { FetchRequestClient } from "../core/requestClient/fetch/FetchRequestClient";
import { RequestClient } from "../core/RequestClient";

export class HgFrontend {

    /**
     * This method will initialize our libraries using frontend implementations.
     *
     * Right now it will call `RequestClient.setClient()` with a standard fetch
     * implementation.
     *
     * @param requestClient
     */
    public static initialize (
        requestClient ?: RequestClientInterface | undefined
    ) {
        if (!requestClient) {
            const w = WindowObjectService.getWindow();
            if (!w) throw new TypeError(`HgFrontend.initialize(): Window object could not be found`);
            requestClient = new FetchRequestClient( w.fetch.bind(w) );
        }
        RequestClient.setClient(requestClient);
    }

}

