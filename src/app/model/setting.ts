export class ReportDueConfiguration{
    daysBefore: number[];
    afterNoOfHours: number[];
    afterNoOfDays: number[];
}
export class ScheduledTaskConfiguration{
    message: string;
    messageDescription: string;
    subject: string;
    subjectDescription: string;
    time: string;
    timeDescription: string;
    configuration: ReportDueConfiguration;
    configurationDescription: string;
    sql: string;
}

export class AppSetting{
    id: number;
    configName: string;
    configValue: string;
    description: string;
    configurable: boolean;
    scheduledTaskConfiguration: ScheduledTaskConfiguration;
    type: string;
    key:number;
}

