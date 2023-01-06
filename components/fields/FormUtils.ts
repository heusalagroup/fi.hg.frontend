// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isTextFieldModel} from "../../types/items/TextFieldModel";
import { TextField } from "./text/TextField";
import { isIntegerFieldModel} from "../../types/items/IntegerFieldModel";
import { IntegerField } from "./integer/IntegerField";
import { FormFieldModel } from "../../types/FormFieldModel";
import { isCheckboxFieldModel} from "../../types/items/CheckboxFieldModel";
import { CheckboxField } from "./checkbox/CheckboxField";
import { FormItem } from "../../types/FormItem";
import { PageBreakModel, isPageBreakModel} from "../../types/items/PageBreakModel";
import { filter } from "../../../core/functions/filter";
import { find } from "../../../core/functions/find";
import { FormItemType } from "../../types/FormItemType";
import { TextAreaField } from "./textArea/TextAreaField";
import { isTextAreaFieldModel} from "../../types/items/TextAreaFieldModel";
import { SelectField } from "./select/SelectField";
import { isSelectFieldModel} from "../../types/items/SelectFieldModel";
import { isPasswordFieldModel} from "../../types/items/PasswordFieldModel";
import { PasswordField } from "./password/PasswordField";
import { EmailField } from "./email/EmailField";
import { isEmailFieldModel} from "../../types/items/EmailFieldModel";
import { isSliderFieldModel } from "../../types/items/SliderFieldModel";
import { SliderField } from "./slider/SliderField";
import { isJsonFieldModel } from "../../types/items/JsonFieldModel";
import { JsonField } from "./json/JsonField";

export class FormUtils {

    static getComponentForModel (item: FormFieldModel) : any {

        if (isTextFieldModel(item)) {
            return TextField;
        }

        if (isIntegerFieldModel(item)) {
            return IntegerField;
        }

        if (isCheckboxFieldModel(item)) {
            return CheckboxField;
        }

        if (isJsonFieldModel(item)) {
            return JsonField;
        }

        if (isTextAreaFieldModel(item)) {
            return TextAreaField;
        }

        if (isEmailFieldModel(item)) {
            return EmailField;
        }

        if (isPasswordFieldModel(item)) {
            return PasswordField;
        }

        if (isSelectFieldModel(item)) {
            return SelectField;
        }

        if (isSliderFieldModel(item)) {
            return SliderField;
        }

        return undefined;

    }

    static getPageCount (items: FormItem[]) : number {

        const pageBreaks = filter(items, (item : FormItem) => isPageBreakModel(item));
        const pageBreakCount = pageBreaks.length;
        return pageBreakCount + 1;

    }

    static getPageItems (pageIndex: number, items : FormItem[]) : FormItem[] {

        let currentPage = 0;

        return filter(items, (item : FormItem) => {
            if (item?.type === FormItemType.PAGE_BREAK) {
                currentPage += 1;
                return false;
            } else {
                return currentPage === pageIndex;
            }
        });

    }

    static getPageBreak (pageIndex: number, items : FormItem[]) : PageBreakModel | undefined {

        let currentPage = 0;

        return find(items, (item : FormItem) => {

            if (item?.type === FormItemType.PAGE_BREAK) {
                if (currentPage === pageIndex) {
                    return true;
                } else {
                    currentPage += 1;
                }
            }

            return false;

        }) as PageBreakModel | undefined;

    }

}


