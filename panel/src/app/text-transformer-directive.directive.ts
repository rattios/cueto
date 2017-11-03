import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Directive, forwardRef, Input, OnChanges, SimpleChanges, Renderer, ElementRef } from '@angular/core';
//import { TextMaskModule, MaskedInputDirective } from 'angular2-text-mask';

@Directive({
  selector: 'input[transformer]',
  // When the user updates the input
  host: { '(input)': 'handleInput($event.target.value)', '(blur)': 'onTouched()' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextTransformerDirective), multi: true },
  ]

})
export class TextTransformerDirective implements ControlValueAccessor {
  private inputElement: HTMLInputElement
  lastValue = "";
  onTouched = () => { }
  onChange = (_: any) => { }
  @Input('transformer')
  transformer = (v: string) => v;

  constructor(private renderer: Renderer, private element: ElementRef) {

  }

  handleInput(value: any) {
    let newVal = this.transformer(value);
    if (newVal != value || this.lastValue != newVal) {
      this.lastValue = newVal;
      this.renderer.setElementProperty(this.element.nativeElement, 'value', newVal);
      this.onChange(newVal);
    }
  }

  writeValue(value: any) {
    let normalizedValue = value == null ? '' : value;
    normalizedValue = this.transformer(normalizedValue);
    this.renderer.setElementProperty(this.element.nativeElement, 'value', normalizedValue);
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn }

  registerOnTouched(fn: () => any): void { this.onTouched = fn }

}