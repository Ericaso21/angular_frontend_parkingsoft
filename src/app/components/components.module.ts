import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeadersComponent } from './headers/headers.component';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    HeadersComponent,
  ],
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    HeadersComponent,
  ],
})
export class ComponentsModule {}
