import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarRendicionesComponent } from './aprobar-rendiciones.component';

describe('AprobarRendicionesComponent', () => {
  let component: AprobarRendicionesComponent;
  let fixture: ComponentFixture<AprobarRendicionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarRendicionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarRendicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
