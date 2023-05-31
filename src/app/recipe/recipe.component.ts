import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html'
})
export class RecipeComponent {

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  recipe: any;

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.params['recipeId'];
    this.httpClient.get('https://mychef.prayoshaprintnpacks.com/prompt', { params: { id } }).subscribe(response => {
      this.recipe = response;
      this.recipe.allergies = JSON.parse(this.recipe.allergies);
      if (this.recipe.cuisine?.includes('[')) {
        this.recipe.cuisine = JSON.parse(this.recipe.cuisine);
      }
      this.recipe.minerals = JSON.parse(this.recipe.minerals);
      this.recipe.vitamins = JSON.parse(this.recipe.vitamins);

      var newScript = this.document.createElement("script");
      newScript.type = "application/ld+json";
      var inlineScript = this.document.createTextNode(`
        {
          "@context": "https://schema.org/",
          "@type": "Recipe",
          "name": "${this.getRecipeName().trim()}",
          "recipeIngredient": ${this.getRecipeIngredient()},
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5", 
            "ratingCount": "18"
          }
        }
      `);
      newScript.appendChild(inlineScript);
      this.document.head.appendChild(newScript);

      var newScript1 = this.document.createElement("script");
      var inlineScript1 = this.document.createTextNode(`
      (function (d, s, id, a) { var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; } js = d.createElement(s); js.id = id;
        js.src = "https://widgets.instacart.com/widget-bundle-v2.js"; js.async = true;
        js.dataset.source_origin = "affiliate_hub"; fjs.parentNode.insertBefore(js, fjs); })
      (document, "script", "standard-instacart-widget-v1");
      `);
      newScript1.appendChild(inlineScript1);
      document.head.appendChild(newScript1);
    });
  }

  getRecipeName() {
    let substring = this.recipe.promptResponse.split("\n");
    let recipieName = substring.find((s: any) => s.includes("Recipe Name"));
    let name = recipieName.split(":")[1];
    return name;
  }

  getRecipeIngredient() {
    let substrings = this.recipe.promptResponse.split("\n- ");
    let recipieIngredientsIndex = substrings.findIndex((s: any) => s.includes("Recipe Ingredients"));
    let cookingInstructionsIndex = substrings.findIndex((s: any) => s.includes("Cooking Instructions"));
    let ingredients = substrings.slice(recipieIngredientsIndex + 1, cookingInstructionsIndex - 1);
    return JSON.stringify(ingredients)
  }

  getIngredients() {
    return JSON.parse(this.getRecipeIngredient());
  }

  getName() {
    return this.getRecipeName().trim();
  }
}
