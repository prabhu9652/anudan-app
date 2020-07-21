import { Injectable } from "@angular/core";
import { Attribute } from "./model/dahsboard";

@Injectable({
    providedIn: 'root',
})
export class AttributeService {

    checkIfEmpty(attr: Attribute): boolean {
        // if(attr.fieldName && attr.fieldName.trim()!==''){
        //     return false;
        // }

        if (attr.fieldType === 'multiline') {
            if (attr.fieldValue && attr.fieldValue.trim() !== '') {
                return false;
            }
        }
        if (attr.fieldType === 'kpi') {
            if (attr.target && attr.target !== null) {
                return false;
            }
            if (attr.frequency && attr.frequency.trim() !== 'none' && attr.frequency.trim() !== 'adhoc' && attr.frequency.trim() !== '') {
                return false;
            }
        }

        if (attr.fieldType === 'table') {
            for (let tabData of attr.fieldTableValue) {
                if ((tabData.name && tabData.name.trim() !== '') || (tabData.header && tabData.header.trim() !== '')) {
                    return false;
                }
                for (let col of tabData.columns) {
                    if ((col.name && col.name.trim() !== '') || (col.value && col.value.trim() !== '')) {
                        return false;
                    }
                }
            }
        }

        if (attr.fieldType === 'document') {
            if (attr.attachments && attr.attachments.length > 0) {
                return false;
            }
        }

        if (attr.fieldType === 'disbursement') {
            for (let tabData of attr.fieldTableValue) {
                if ((tabData.header && tabData.header.trim() !== '')) {
                    return false;
                }
                for (let col of tabData.columns) {
                    if ((col.value && col.value.toString().trim() !== '')) {
                        return false;
                    }
                }
            }
        }

        return true;

    };
}