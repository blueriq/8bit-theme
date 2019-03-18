import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentLink } from '@blueriq/angular/files';
import { BlueriqSessionTemplate, BlueriqTestingModule, BlueriqTestSession } from '@blueriq/angular/testing';
import { ContainerTemplate, LinkTemplate } from '@blueriq/core/testing';
import { BqPresentationStyles } from '../../BqPresentationStyles';
import { FileDownloadService } from '../file-download/file-download.service';
import { FileModule } from '../file.modules';
import { DocumentLinkComponent } from './document-link.component';

describe('DocumentLinkComponent', () => {

  const LINK_TEXT = 'clickme';
  const DOCUMENT_NAME = 'downloadme';

  let container: ContainerTemplate;
  let component: ComponentFixture<DocumentLinkComponent>;
  let session: BlueriqTestSession;
  let mockFileDownloadService: FileDownloadService;

  beforeEach(async(() => {
    mockFileDownloadService = jasmine.createSpyObj(['download']);
    TestBed.configureTestingModule({
      providers: [
        { provide: FileDownloadService, useValue: mockFileDownloadService },
      ],
      imports: [
        FileModule,
        NoopAnimationsModule,
        BlueriqTestingModule,
      ],
    });
  }));

  beforeEach(() => {
    container = ContainerTemplate.create('DocumentLink');
    container.children(
      LinkTemplate.create().text(LINK_TEXT).document(DOCUMENT_NAME, 'pdf'),
    );
    session = BlueriqSessionTemplate.create().build(container);
    component = session.get(DocumentLinkComponent);
  });

  it('should contain the correct data', () => {
    const element = component.nativeElement.querySelector('p');
    expect(element.getAttribute('class')).toContain('plain-link');
    expect(element.innerHTML.trim()).toContain(LINK_TEXT);
  });

  it('should contain the correct data when presentation style "Button" is set', () => {
    session.update(
      container.styles(BqPresentationStyles.BUTTON),
    );
    const element = component.nativeElement.querySelector('button');
    expect(element.innerHTML.trim()).toContain(LINK_TEXT);
  });

  it('should contain the correct class when presentation styles "Button"', () => {
    session.update(
      container.styles(BqPresentationStyles.BUTTON),
    );
    const element = component.nativeElement.querySelector('button');
    expect(element.getAttribute('class')).toContain('nes-btn');
    expect(element.innerHTML.trim()).toContain(LINK_TEXT);
  });

  it('should change the href when the download handler is called', () => {
    const element = component.nativeElement.querySelector('p');
    element.click();
    expect(mockFileDownloadService.download).toHaveBeenCalledTimes(1);
  });
});
