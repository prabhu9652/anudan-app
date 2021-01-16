'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Anudan documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminLayoutModule.html" data-type="entity-link">AdminLayoutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminLayoutModule-83cc7c33ff09be8199aa772530824b9f"' : 'data-target="#xs-components-links-module-AdminLayoutModule-83cc7c33ff09be8199aa772530824b9f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminLayoutModule-83cc7c33ff09be8199aa772530824b9f"' :
                                            'id="xs-components-links-module-AdminLayoutModule-83cc7c33ff09be8199aa772530824b9f"' }>
                                            <li class="link">
                                                <a href="components/ActiveGrantsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActiveGrantsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddnlreportsDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddnlreportsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ApplicationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ApplicationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ApprovedReportsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ApprovedReportsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BasicComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BasicComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BottomsheetAttachmentsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BottomsheetAttachmentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BottomsheetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BottomsheetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BottomsheetNotesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BottomsheetNotesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChartSummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChartSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClosedGrantsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClosedGrantsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DisbursementsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisbursementsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DraftGrantsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DraftGrantsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FieldDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FieldDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GrantComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GrantComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GrantNotesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GrantNotesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GrantSelectionDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GrantSelectionDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GrantTemplateDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GrantTemplateDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GrantsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GrantsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IconsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IconsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InviteDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InviteDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotificationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrgadminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrgadminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrganizationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrganizationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PortfolioSummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PortfolioSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreviewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PreviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgressSummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProgressSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportHeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportNotesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportNotesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportPreviewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportPreviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportSectionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportSectionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportTemplateDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportTemplateDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RfpsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RfpsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RolesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RolesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SectionEditComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SectionEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SectionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SectionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubmittedReportsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubmittedReportsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SummaryCenteredComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SummaryCenteredComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TemplateDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TemplateDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TemplatesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TemplatesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TenantsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TenantsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TypographyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TypographyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpcomingReportsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UpcomingReportsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpgradeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UpgradeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WelcomePopupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WelcomePopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WorkflowManagementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WorkflowManagementComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-18c691be13709b2c29bb5cddb974543d"' : 'data-target="#xs-components-links-module-AppModule-18c691be13709b2c29bb5cddb974543d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-18c691be13709b2c29bb5cddb974543d"' :
                                            'id="xs-components-links-module-AppModule-18c691be13709b2c29bb5cddb974543d"' }>
                                            <li class="link">
                                                <a href="components/AdminLayoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GranthistoryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GranthistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/KpisubmissionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">KpisubmissionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessagingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MessagingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationspopupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotificationspopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistrationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WelcomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WelcomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WfassignmentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WfassignmentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ComponentsModule.html" data-type="entity-link">ComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ComponentsModule-1699a0672a4f03d3e10b3649ffe3a504"' : 'data-target="#xs-components-links-module-ComponentsModule-1699a0672a4f03d3e10b3649ffe3a504"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ComponentsModule-1699a0672a4f03d3e10b3649ffe3a504"' :
                                            'id="xs-components-links-module-ComponentsModule-1699a0672a4f03d3e10b3649ffe3a504"' }>
                                            <li class="link">
                                                <a href="components/EditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccessCredentials.html" data-type="entity-link">AccessCredentials</a>
                            </li>
                            <li class="link">
                                <a href="classes/Action.html" data-type="entity-link">Action</a>
                            </li>
                            <li class="link">
                                <a href="classes/ActionAuthorities.html" data-type="entity-link">ActionAuthorities</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdditionReportsModel.html" data-type="entity-link">AdditionReportsModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnudanErrorHandler.html" data-type="entity-link">AnudanErrorHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppConfig.html" data-type="entity-link">AppConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppSetting.html" data-type="entity-link">AppSetting</a>
                            </li>
                            <li class="link">
                                <a href="classes/Attachment.html" data-type="entity-link">Attachment</a>
                            </li>
                            <li class="link">
                                <a href="classes/AttachmentDownloadRequest.html" data-type="entity-link">AttachmentDownloadRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/AttachmentTemplates.html" data-type="entity-link">AttachmentTemplates</a>
                            </li>
                            <li class="link">
                                <a href="classes/Attribute.html" data-type="entity-link">Attribute</a>
                            </li>
                            <li class="link">
                                <a href="classes/AttributeDiff.html" data-type="entity-link">AttributeDiff</a>
                            </li>
                            <li class="link">
                                <a href="classes/Colors.html" data-type="entity-link">Colors</a>
                            </li>
                            <li class="link">
                                <a href="classes/ColumnData.html" data-type="entity-link">ColumnData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Configuration.html" data-type="entity-link">Configuration</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomDateAdapter.html" data-type="entity-link">CustomDateAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Doc.html" data-type="entity-link">Doc</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocInfo.html" data-type="entity-link">DocInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocumentKpiSubmission.html" data-type="entity-link">DocumentKpiSubmission</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorMessage.html" data-type="entity-link">ErrorMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/FieldInfo.html" data-type="entity-link">FieldInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/Filedata.html" data-type="entity-link">Filedata</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileTemplates.html" data-type="entity-link">FileTemplates</a>
                            </li>
                            <li class="link">
                                <a href="classes/FlowAuthority.html" data-type="entity-link">FlowAuthority</a>
                            </li>
                            <li class="link">
                                <a href="classes/Grant.html" data-type="entity-link">Grant</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantDetails.html" data-type="entity-link">GrantDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantDiff.html" data-type="entity-link">GrantDiff</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantHistory.html" data-type="entity-link">GrantHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantKpi.html" data-type="entity-link">GrantKpi</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantNote.html" data-type="entity-link">GrantNote</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantorOrganization.html" data-type="entity-link">GrantorOrganization</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantSnapshot.html" data-type="entity-link">GrantSnapshot</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrantTemplate.html" data-type="entity-link">GrantTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Kpi.html" data-type="entity-link">Kpi</a>
                            </li>
                            <li class="link">
                                <a href="classes/KpiSubmissionData.html" data-type="entity-link">KpiSubmissionData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Note.html" data-type="entity-link">Note</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoteTemplates.html" data-type="entity-link">NoteTemplates</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notifications.html" data-type="entity-link">Notifications</a>
                            </li>
                            <li class="link">
                                <a href="classes/Organization.html" data-type="entity-link">Organization</a>
                            </li>
                            <li class="link">
                                <a href="classes/Organization-1.html" data-type="entity-link">Organization</a>
                            </li>
                            <li class="link">
                                <a href="classes/PdfDocument.html" data-type="entity-link">PdfDocument</a>
                            </li>
                            <li class="link">
                                <a href="classes/Permission.html" data-type="entity-link">Permission</a>
                            </li>
                            <li class="link">
                                <a href="classes/QualitativeKpiSubmission.html" data-type="entity-link">QualitativeKpiSubmission</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuantitiaveKpisubmission.html" data-type="entity-link">QuantitiaveKpisubmission</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegistrationCredentials.html" data-type="entity-link">RegistrationCredentials</a>
                            </li>
                            <li class="link">
                                <a href="classes/Release.html" data-type="entity-link">Release</a>
                            </li>
                            <li class="link">
                                <a href="classes/Report.html" data-type="entity-link">Report</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportAssignment.html" data-type="entity-link">ReportAssignment</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportDetails.html" data-type="entity-link">ReportDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportDiff.html" data-type="entity-link">ReportDiff</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportDocInfo.html" data-type="entity-link">ReportDocInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportDueConfiguration.html" data-type="entity-link">ReportDueConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportFieldInfo.html" data-type="entity-link">ReportFieldInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportHistory.html" data-type="entity-link">ReportHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportNote.html" data-type="entity-link">ReportNote</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportSectionInfo.html" data-type="entity-link">ReportSectionInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportSnapshot.html" data-type="entity-link">ReportSnapshot</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportTemplate.html" data-type="entity-link">ReportTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportWorkflowAssignment.html" data-type="entity-link">ReportWorkflowAssignment</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportWorkflowAssignmentModel.html" data-type="entity-link">ReportWorkflowAssignmentModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rfp.html" data-type="entity-link">Rfp</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link">Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScheduledTaskConfiguration.html" data-type="entity-link">ScheduledTaskConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="classes/Section.html" data-type="entity-link">Section</a>
                            </li>
                            <li class="link">
                                <a href="classes/SectionDiff.html" data-type="entity-link">SectionDiff</a>
                            </li>
                            <li class="link">
                                <a href="classes/SectionInfo.html" data-type="entity-link">SectionInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/SerializationHelper.html" data-type="entity-link">SerializationHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatePermission.html" data-type="entity-link">StatePermission</a>
                            </li>
                            <li class="link">
                                <a href="classes/Submission.html" data-type="entity-link">Submission</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubmissionData.html" data-type="entity-link">SubmissionData</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubmissionStatus.html" data-type="entity-link">SubmissionStatus</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableData.html" data-type="entity-link">TableData</a>
                            </li>
                            <li class="link">
                                <a href="classes/Template.html" data-type="entity-link">Template</a>
                            </li>
                            <li class="link">
                                <a href="classes/Template-1.html" data-type="entity-link">Template</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemplateAttribute.html" data-type="entity-link">TemplateAttribute</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemplateLibrary.html" data-type="entity-link">TemplateLibrary</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemplateSection.html" data-type="entity-link">TemplateSection</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tenant.html" data-type="entity-link">Tenant</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tenants.html" data-type="entity-link">Tenants</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadFile.html" data-type="entity-link">UploadFile</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRole.html" data-type="entity-link">UserRole</a>
                            </li>
                            <li class="link">
                                <a href="classes/Verification.html" data-type="entity-link">Verification</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkflowAssignment.html" data-type="entity-link">WorkflowAssignment</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkflowAssignmentModel.html" data-type="entity-link">WorkflowAssignmentModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkflowLinks.html" data-type="entity-link">WorkflowLinks</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkflowNode.html" data-type="entity-link">WorkflowNode</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkflowStatus.html" data-type="entity-link">WorkflowStatus</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkflowTransition.html" data-type="entity-link">WorkflowTransition</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link">DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileUploadService.html" data-type="entity-link">FileUploadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GrantDataService.html" data-type="entity-link">GrantDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GrantUpdateService.html" data-type="entity-link">GrantUpdateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReportDataService.html" data-type="entity-link">ReportDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SingleReportDataService.html" data-type="entity-link">SingleReportDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubmissionDataService.html" data-type="entity-link">SubmissionDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UpdateService.html" data-type="entity-link">UpdateService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuardService.html" data-type="entity-link">AuthGuardService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Fruit.html" data-type="entity-link">Fruit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Marker.html" data-type="entity-link">Marker</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RouteInfo.html" data-type="entity-link">RouteInfo</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});