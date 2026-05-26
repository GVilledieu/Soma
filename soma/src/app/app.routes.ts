import { Routes } from '@angular/router';
import { BodyMapComponent } from './features/body-map/body-map.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: "bodymap", component: BodyMapComponent },
    { path : '', component: AppComponent }
];
