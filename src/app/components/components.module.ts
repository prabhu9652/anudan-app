import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {EditorComponent} from './editor/editor.component';
import {MatButtonModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    EditorComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule {
}
