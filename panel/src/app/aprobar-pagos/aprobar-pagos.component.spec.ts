import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarPagosComponent } from './aprobar-pagos.component';

describe('AprobarPagosComponent', () => {
  let component: AprobarPagosComponent;
  let fixture: ComponentFixture<AprobarPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
