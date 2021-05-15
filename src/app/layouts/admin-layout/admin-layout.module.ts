import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule } from 'highcharts-angular';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { NgxPrintModule } from 'ngx-print';
import { SpinnerDottedModule } from 'spinners-angular/spinner-dotted';
import { SpinnersAngularModule } from 'spinners-angular';
import {FulfillingBouncingCircleSpinnerModule} from 'angular-epic-spinners'
import {CardModule} from 'primeng/card';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    HighchartsChartModule,
    TableModule,
    ProgressBarModule,
    InputTextModule,
    SelectButtonModule,
    RippleModule,
    ButtonModule,
    NgxPrintModule,
    FulfillingBouncingCircleSpinnerModule,
    CardModule,

    // SpinnerDottedModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
  ],
})
export class AdminLayoutModule {}
