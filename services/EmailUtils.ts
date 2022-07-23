import { isString } from "../../core/modules/lodash";

export class EmailUtils {

    public static isEmailValid (value: string) : boolean {
        if (!isString(value)) {
            return false;
        }
        const l = value?.length ?? 0;
        return l >= 3 && value.includes('@') && !'@.'.includes(value[0]) && !'@.'.includes(value[l-1]);
    }

}
