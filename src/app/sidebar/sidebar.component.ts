import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/uptodatecase',      title: 'GÜNCEL DURUM',        icon: 'nc-bank',              class: '' },
    { path: '/vaccinemaps',       title: 'AŞI HARİTASI',        icon: 'nc-diamond',           class: '' },
    { path: '/riskmaps',          title: 'RİSK HARİTASI',       icon: 'nc-pin-3',             class: '' },
    { path: '/info',              title: 'SEMPTOMPLAR',         icon: 'nc-alert-circle-i',    class: '' },
    { path: '/generalcase',       title: 'GENEL DURUM ',        icon: 'nc-chart-bar-32',      class: '' },
    { path: '/typography',        title: 'Typography',          icon: 'nc-caps-small',        class: '' },
    { path: '/upgrade',           title: '#EVDE KAL',           icon: 'nc-planet',            class: 'active-pro' },
    { path: '/globalcase',        title: 'DÜNYADA DURUM',       icon: 'nc-world-2',           class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
