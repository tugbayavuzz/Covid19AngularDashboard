import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Genel Durum ',         icon: 'nc-bank',       class: '' },
    { path: '/vaccine',       title: 'Aşı Durum',            icon: 'nc-diamond',    class: '' },
    { path: '/maps',          title: 'Harita',               icon: 'nc-pin-3',      class: '' },
    { path: '/info',          title: 'Semptomplar',          icon: 'nc-bell-55',    class: '' },
    { path: '/news',          title: 'Covid 19 Haberler ',   icon: 'nc-single-02',  class: '' },
    { path: '/global',        title: 'Table List',           icon: 'nc-tile-56',    class: '' },
    { path: '/typography',    title: 'Typography',           icon: 'nc-caps-small', class: '' },
    { path: '/upgrade',       title: '#EVDE KAL',            icon: 'nc-planet',     class: 'active-pro' },
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
