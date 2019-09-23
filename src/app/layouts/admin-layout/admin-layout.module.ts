import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {GrantComponent} from '../../grant/grant.component';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {TableListComponent} from '../../table-list/table-list.component';
import {TypographyComponent} from '../../typography/typography.component';
import {IconsComponent} from '../../icons/icons.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {UpgradeComponent} from '../../upgrade/upgrade.component';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatCardModule,
    MatBottomSheetModule,
    MatListModule,
    MatBadgeModule,
    MatChipsModule,
    MatSidenavModule,
    MatRadioModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule
} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {FieldDialogComponent} from '../../components/field-dialog/field-dialog.component';
import {GrantTemplateDialogComponent} from '../../components/grant-template-dialog/grant-template-dialog.component';
import {TemplateDialogComponent} from '../../components/template-dialog/template-dialog.component';
import {BottomsheetComponent} from '../../components/bottomsheet/bottomsheet.component';
import {BottomsheetAttachmentsComponent} from '../../components/bottomsheetAttachments/bottomsheetAttachments.component';
import {BottomsheetNotesComponent} from '../../components/bottomsheetNotes/bottomsheetNotes.component';
import {WorkflowManagementComponent} from '../../workflow-management/workflow-management.component';
import {GrantsComponent} from '../../grants/grants.component';
import {ApplicationsComponent} from '../../applications/applications.component';
import {ReportsComponent} from '../../reports/reports.component';
import {DisbursementsComponent} from '../../disbursements/disbursements.component';
import {DetailsComponent} from '../../organization/details/details.component';
import {OrgadminComponent} from '../../organization/orgadmin/orgadmin.component';
import {OrganizationComponent} from '../../organization/organization.component';
import {RfpsComponent} from '../../rfps/rfps.component';
import {BasicComponent} from '../../grant/basic/basic.component';
import {SectionsComponent} from '../../grant/sections/sections.component';
import {ReportingComponent} from '../../grant/reporting/reporting.component';
import {PreviewComponent} from '../../grant/preview/preview.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatIconModule,
        MatDialogModule,
        MatCheckboxModule,
        MatCardModule,
        MatBottomSheetModule,
        MatListModule,
        MatBadgeModule,
        MatChipsModule,
        MatSidenavModule,
        MatRadioModule,
        MatTableModule,
        MatProgressSpinnerModule,
        NgxGraphModule,
        MatAutocompleteModule,
        MatTabsModule
    ],
    declarations: [
        GrantComponent,
        DashboardComponent,
        GrantsComponent,
        BasicComponent,
        SectionsComponent,
        ReportingComponent,
        PreviewComponent,
        UserProfileComponent,
        TableListComponent,
        TypographyComponent,
        IconsComponent,
        MapsComponent,
        NotificationsComponent,
        UpgradeComponent,
        FieldDialogComponent,
        GrantTemplateDialogComponent,
        TemplateDialogComponent,
        BottomsheetComponent,
        BottomsheetAttachmentsComponent,
        BottomsheetNotesComponent,
        WorkflowManagementComponent,
        ApplicationsComponent,
        RfpsComponent,
        DetailsComponent,
        OrgadminComponent,
        OrganizationComponent,
        ReportsComponent,
        DisbursementsComponent
    ],
    entryComponents: [FieldDialogComponent, BottomsheetComponent, BottomsheetAttachmentsComponent, BottomsheetNotesComponent, GrantTemplateDialogComponent, TemplateDialogComponent],
    schemas: [NO_ERRORS_SCHEMA]
})

export class AdminLayoutModule {
}
