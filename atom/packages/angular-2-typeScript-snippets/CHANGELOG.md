## 0.7

- Add snippets for jasmine
  - `afterAll`, `afterEach`
  - `beforeAll`, `beforeEach`
  - `describe`, `fdescribe`, `xdescribe`
  - `it`, `xit`, `fit`

## 0.6.3

- Updates `ngSwitchWhen` to `ngSwitchCase`

## 0.6.2

- Fixes `ngFor` snippet

## 0.6.0

- Adds snippet `ng2-module` (#1)

  ```ts
  import { NgModule } from '@angular/core';

  @NgModule({
    imports: [<Modules>],
    declarations: [<Components>, <Directives>],
    providers: [<Services>]
  })
  export class <ModuleName> { }
  ```

## 0.5.1

- Adds snippet `ng2-input`
  ```ts
  @Input() <peroperty>: <type>;
  ```
- Adds snippet `ng2-output`
  ```ts
  @Output() <event>: EventEmitter<type> = new EventEmitter();
  ```
- Fixes bootstrap-snippet

## 0.4.6

- Adds html snippet `ng2-property`
  ```html
  <div [property]="value"></div>
  ```
- Adds html snippet `ng2-event`
  ```html
  <div (event)="callback()"></div>
  ```

## 0.4.5

- Adds snippet `ng2-import`
  ```ts
  import {<Module or Component>} from '<path to component>';
  ```

## 0.4.4

- Adds snippet `ng2-directive`

## 0.4.3

- Doc imporovements

## 0.4.2

- Typo fixes

## 0.4.0

- Documents each snippet
- Introduces overview table for snippets referencing to more detailed explanation
- Fixes `ng2-component`, `ng2-ngModel`, `ng2-bootstrap`, `ng2-route-path`

## 0.1.0

- Ports Snippets from [Angular 2 TypeScript Snippets for VS Code](https://github.com/johnpapa/vscode-angular2-snippets) (version `0.4.4`)
