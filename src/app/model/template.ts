import {TableData, ColumnData} from './dahsboard'
export class Template{
    type:string;
    name:string;
    description:string;
    sections:TemplateSection[];
    _default: boolean = true;
}

export class TemplateSection{
    name:string;
    order: number;
    attributes: TemplateAttribute[];
}

export class TemplateAttribute{
    name:string;
    order: number;
    type: string;
    table?:string;
    tableValue: TableData[];

}