import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";

import {TaskListComponent} from "./todo/components/task-list.component";
import {AboutComponent} from "./about/components/about.component";
import {AlarmComponent} from "./alarm/components/alarm.component";

const appRoutes: Routes = [
    {path: '', redirectTo: 'config', pathMatch: 'full'},
    {path: 'config', component: TaskListComponent, data: {title: '구성'}},
    {path: 'alert', component: AboutComponent, data: {title: 'About'}},
    {path: 'alarm', component: AlarmComponent, data: {title: '알람'}},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
