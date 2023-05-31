import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

// components
import { AppComponent } from './app.component';
import { RecipeComponent } from './recipe/recipe.component';

const routes: Routes = [
  {
    path: 'recipe/:recipeId',
    component: RecipeComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RecipeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
