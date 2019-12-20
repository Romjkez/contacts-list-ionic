import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesPage } from './favorites-page.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: FavoritesPage}])
    ],
    declarations: [FavoritesPage]
})
export class Favorites {
}
