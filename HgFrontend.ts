// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { RequestClientAdapter } from "../core/requestClient/RequestClientAdapter";
import { WindowObjectService } from "../core/WindowObjectService";
import { FetchRequestClient } from "../core/requestClient/fetch/FetchRequestClient";
import { RequestClientImpl } from "../core/RequestClientImpl";

export class HgFrontend {

    /**
     * This method will initialize our libraries using frontend implementations.
     *
     * Right now it will call `RequestClientImpl.setClient()` with a standard fetch
     * implementation.
     *
     * @param requestClient The request client adapter to be used by default
     */
    public static initialize (
        requestClient ?: RequestClientAdapter | undefined
    ) {
        if (!requestClient) {
            const w = WindowObjectService.getWindow();
            if (!w) throw new TypeError(`HgFrontend.initialize(): Window object could not be found`);
            requestClient = new FetchRequestClient( w.fetch.bind(w) );
        }
        RequestClientImpl.setClient(requestClient);
    }

}

