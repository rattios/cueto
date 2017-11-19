import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitirRecibosCobroComponent } from './emitir-recibos-cobro.component';

describe('EmitirRecibosCobroComponent', () => {
  let component: EmitirRecibosCobroComponent;
  let fixture: ComponentFixture<EmitirRecibosCobroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitirRecibosCobroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitirRecibosCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
