import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Genel Durum ',         icon: 'nc-bank',       class: '' },
    { path: '/icons',         title: 'Aşı Durum',             icon: 'nc-diamond',    class: '' },
    { path: '/maps',          title: 'Harita',              icon: 'nc-pin-3',      class: '' },
    { path: '/notifications', title: 'Covid 19 Haberler',     icon: 'nc-bell-55',    class: '' },
    { path: '/user',          title: 'Semptomplar',      icon: 'nc-single-02',  class: '' },
    { path: '/table',         title: 'Table List',        icon: 'nc-tile-56',    class: '' },
    { path: '/typography',    title: 'Typography',        icon: 'nc-caps-small', class: '' },
    { path: '/upgrade',       title: '#EVDE KAL',    icon: 'nc-planet',  class: 'active-pro' },
];

@Component({
    moduleId: module.id,
  // tslint:disable-next-line:component-selector
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
