// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { momentType } from "../../../../../core/modules/moment";
import { CalendarStyling } from "./CalendarStyling";

export interface CalendarStylingCallback {
    (day: momentType): CalendarStyling;
}
