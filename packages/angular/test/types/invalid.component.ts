import { Component } from '@angular/core';
import { UNFRAMED } from '@unframed/angular';

@Component({
  selector: 'app-invalid',
  imports: [UNFRAMED],
  template: `<uf-button [variant]="'nope'">x</uf-button>`,
})
export class InvalidComponent {}
