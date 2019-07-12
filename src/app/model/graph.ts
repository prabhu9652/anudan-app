export class WorkflowNode {
    id: string;
    label: string;


    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }
}

export class WorkflowLinks {
    id: string;
    source: string;
    target: string;
    label: string;


    constructor(id: string, source: string, target: string, label: string) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.label = label;
    }
}
