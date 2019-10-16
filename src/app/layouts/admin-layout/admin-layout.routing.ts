import {Routes} from '@angular/router';

import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {TableListComponent} from '../../table-list/table-list.component';
import {TypographyComponent} from '../../typography/typography.component';
import {IconsComponent} from '../../icons/icons.component';
import {MapsComponent} from '../../maps/maps.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {UpgradeComponent} from '../../upgrade/upgrade.component';
import {GrantComponent} from '../../grant/grant.component';
import {ApplicationsComponent} from '../../applications/applications.component';
import {ReportsComponent} from '../../reports/reports.component';
import {DisbursementsComponent} from '../../disbursements/disbursements.component';
import {DetailsComponent} from '../../organization//details/details.component';
import {OrgadminComponent} from '../../organization//orgadmin/orgadmin.component';
import {RfpsComponent} from '../../rfps/rfps.component';
import {WorkflowManagementComponent} from "../../workflow-management/workflow-management.component";
import {GrantsComponent} from '../../grants/grants.component';
import {BasicComponent} from '../../grant/basic/basic.component';
import {SectionsComponent} from '../../grant/sections/sections.component';
import {ReportingComponent} from '../../grant/reporting/reporting.component';
import {PreviewComponent} from '../../grant/preview/preview.component';
import {TenantsComponent} from '../../admin/tenants/tenants.component';

export const AdminLayoutRoutes: Routes = [
  // {
  //   path: '',
  //   children: [ {
  //     path: 'dashboard',
  //     component: DashboardComponent
  // }]}, {
  // path: '',
  // children: [ {
  //   path: 'userprofile',
  //   component: UserProfileComponent
  // }]
  // }, {
  //   path: '',
  //   children: [ {
  //     path: 'icons',
  //     component: IconsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'notifications',
  //         component: NotificationsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'maps',
  //         component: MapsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'typography',
  //         component: TypographyComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'upgrade',
  //         component: UpgradeComponent
  //     }]
  // }
  {path: 'dashboard', component: DashboardComponent},
  {path: 'grants', component: GrantsComponent},
  {path: 'applications', component: ApplicationsComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'disbursements', component: DisbursementsComponent},
  {path: 'organization/details', component: DetailsComponent},
  {path: 'organization/administration', component: OrgadminComponent},
  {path: 'rfps', component: RfpsComponent},
  {path: 'grant/basic-details', component: BasicComponent},
  {path: 'grant/sections', component: SectionsComponent},
  {path: 'grant/section/:action', component: SectionsComponent},
  {path: 'grant/reporting', component: ReportingComponent},
  {path: 'grant/preview', component: PreviewComponent},
  {path: 'section', component: GrantComponent},
  {path: 'user-profile', component: UserProfileComponent},
  {path: 'table-list', component: TableListComponent},
  {path: 'typography', component: TypographyComponent},
  {path: 'icons', component: IconsComponent},
  {path: 'maps', component: MapsComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: 'upgrade', component: UpgradeComponent},
  {path: 'workflow-management', component: WorkflowManagementComponent},
  {path: 'admin/tenants', component: TenantsComponent}
];