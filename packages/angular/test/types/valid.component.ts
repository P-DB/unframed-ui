import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UNFRAMED, type UfDialog } from '@unframed/angular';
import { UfButton as EntryButton } from '@unframed/angular/button';
import { UfInput as EntryInput, UfTextValueAccessor } from '@unframed/angular/input';
import { UfSwitch as EntrySwitch, UfCheckedValueAccessor } from '@unframed/angular/switch';

@Component({
  selector: 'app-valid',
  imports: [UNFRAMED, FormsModule, ReactiveFormsModule],
  template: `
    <uf-input [(ngModel)]="email" type="email" label="Email" required />
    <uf-checkbox [(ngModel)]="agree">Agree</uf-checkbox>
    <uf-slider [(ngModel)]="volume" label="Volume" min="0" [max]="100" show-value />
    <uf-checkbox-group [formControl]="toppings" label="Toppings">
      <uf-checkbox select-all [(indeterminate)]="some">All</uf-checkbox>
      <uf-checkbox value="cheese">Cheese</uf-checkbox>
    </uf-checkbox-group>
    <uf-select [formControl]="country"><option value="it">Italy</option></uf-select>
    <uf-button variant="danger" size="lg" [loading]="saving()" disabled (click)="dialog.el.show()">Delete</uf-button>
    <uf-tabs (uf-tab-change)="tab.set($event.detail.name)">
      <uf-tab panel="a">A</uf-tab>
      <uf-tab-panel name="a">A</uf-tab-panel>
    </uf-tabs>
    <uf-dialog #dialog label="Hi" [lightDismiss]="true" (uf-request-close)="onClose($event.detail.source)" />
    <uf-textarea [rows]="3" />
  `,
})
export class ValidComponent {
  email = '';
  agree = false;
  volume = 40;
  some = false;
  toppings = new FormControl<string[]>([]);
  country = new FormControl('it');
  saving = signal(false);
  tab = signal('');
  onClose(source: 'close-button' | 'escape' | 'backdrop' | 'trigger' | 'method'): void {
    void source;
  }
  dialogType?: UfDialog;
}

// Per-component entry points: each brings its component and form directive.
@Component({
  selector: 'app-entries',
  imports: [EntryInput, UfTextValueAccessor, EntrySwitch, UfCheckedValueAccessor, EntryButton, FormsModule],
  template: `
    <uf-input [(ngModel)]="name" label="Name" />
    <uf-switch [(ngModel)]="on">On</uf-switch>
    <uf-button variant="ghost">Save</uf-button>
  `,
})
export class EntriesComponent {
  name = '';
  on = false;
}
