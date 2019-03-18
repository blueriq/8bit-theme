import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlueriqSessionTemplate, BlueriqTestingModule, BlueriqTestSession } from '@blueriq/angular/testing';
import { FieldTemplate } from '@blueriq/core/testing';
import { ReadonlyComponent } from './readonly.component';
import { ReadonlyModule } from './readonly.module';

describe('ReadonlyComponent', () => {
  let field: FieldTemplate;
  let component: ComponentFixture<ReadonlyComponent>;
  let session: BlueriqTestSession;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        BlueriqTestingModule,
        ReadonlyModule,
      ],
    });
  }));

  beforeEach(() => {
    field = FieldTemplate.integer().readonly().value('Pietje').questionText('Uw naam');
    session = BlueriqSessionTemplate.create().build(field);
    component = session.get(ReadonlyComponent);
  });

  it('should display questiontext and value', () => {
    const questiontext = component.nativeElement.querySelector('label');
    const value = component.nativeElement.querySelector('p');
    expect(questiontext.innerText).toContain('Uw naam');
    expect(value.innerText).toContain('Pietje');
  });
});
