import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarRendicionesComponent } from './ingresar-rendiciones.component';

describe('IngresarRendicionesComponent', () => {
  let component: IngresarRendicionesComponent;
  let fixture: ComponentFixture<IngresarRendicionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresarRendicionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarRendicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
