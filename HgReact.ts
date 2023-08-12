// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { createRoot, hydrateRoot } from "react-dom/client";
import { MetricType } from "web-vitals/src/types/base";
import { reportWebVitals } from "./reportWebVitals";
import { LogService } from "../core/LogService";

const LOG = LogService.createLogger( 'HgReact' );

/**
 * Initializes React or React SSR
 */
export class HgReact {

    /**
     * This method will initialize ReactJS.
     */
    public static initialize (
        app           : any,
        rootElementId : string = 'root'
    ) : void {

        const container = document.getElementById(rootElementId);
        if (container) {
            if (container.innerHTML !== "") {
                hydrateRoot( container, app );
            } else {
                const root = createRoot( container );
                root.render(app);
            }
        } else {
            LOG.error(`Could not find root element: ${rootElementId}`);
        }

        // If you want to start measuring performance in your app, pass a function
        // to log results (for example: reportWebVitals(console.log))
        // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
        reportWebVitals((metric: MetricType): void => {
            LOG.debug(`web vitals: `, metric);
        });

    }

}
