import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Search } from '@blueriq/angular/lists';
import { BlueriqSessionTemplate, BlueriqTestingModule, BlueriqTestSession } from '@blueriq/angular/testing';
import { ButtonTemplate, ContainerTemplate, FieldTemplate } from '@blueriq/core/testing';
import { ListComponent } from '../list.component';
import { ListModule } from '../list.module';
import { TableSearchComponent } from './table.search.component';

describe('TableSearchComponent', () => {
  let field: FieldTemplate;
  let button: ButtonTemplate;
  let session: BlueriqTestSession;
  let component: ComponentFixture<ListComponent>;
  let tableSearchComponent: TableSearchComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        BlueriqTestingModule,
        ListModule,
      ],
    });
  });

  beforeEach(() => {
    const list = ContainerTemplate.create().children(TableSearchTemplate(), TableTemplate(), PaginationTemplate());
    session = BlueriqSessionTemplate.create().build(list);
    component = session.get(ListComponent);

    let search!: Search;
    component.componentInstance.list.search$.subscribe(s => search = s!).unsubscribe();

    tableSearchComponent = new TableSearchComponent();
    tableSearchComponent.search = search;
  });

  it('should render', () => {
    const tableSearchElement = component.nativeElement.querySelector('bq-table-search');
    expect(tableSearchElement).toBeTruthy();
  });

  /* The search becomes disabled when a instance list is readonly. The backend can not handle search when this is the case.
     The fix for now is to not render the search */
  it('should not render when search button is disabled', () => {
    const list = ContainerTemplate.create().children(TableSearchTemplate(true), TableTemplate(), PaginationTemplate());
    session = BlueriqSessionTemplate.create().build(list);
    component = session.get(ListComponent);
    const tableSearchInput = component.nativeElement.querySelector('bq-table-search');

    // Verify
    expect(tableSearchInput.querySelector('input')).toBeFalsy();
  });

  it('should render multiple chips', () => {
    session.update(
      field.value(['term1', 'term2', 'term3']),
    );

    expect(component.nativeElement.querySelector('input').value).toBe('term1,term2,term3');
  });

  it('should add a search term', () => {
    spyOn(Search.prototype, 'search').and.callThrough();

    const tableSearchInput = component.nativeElement.querySelector('bq-table-search');
    const searchInput = tableSearchInput.querySelector('input');
    searchInput.value = 'term1';
    searchInput.dispatchEvent(new Event('change'));

    expect(Search.prototype.search).toHaveBeenCalledWith(['term1']);
  });

  it('should not add a search term if a term with different casing is already present', () => {
    spyOn(Search.prototype, 'search').and.callThrough();

    const tableSearchInput = component.nativeElement.querySelector('bq-table-search');
    const searchInput = tableSearchInput.querySelector('input');
    searchInput.value = 'term1,TERM1';
    searchInput.dispatchEvent(new Event('change'));

    expect(Search.prototype.search).toHaveBeenCalledWith(['term1']);
  });

  it('should remove a search term', () => {
    spyOn(Search.prototype, 'search').and.callThrough();

    const tableSearchInput = component.nativeElement.querySelector('bq-table-search');
    const searchInput = tableSearchInput.querySelector('input');
    searchInput.value = 'term1,term2,term3';
    searchInput.dispatchEvent(new Event('change'));
    expect(Search.prototype.search).toHaveBeenCalledWith(['term1', 'term2', 'term3']);

    searchInput.value = 'term1,term2';
    searchInput.dispatchEvent(new Event('change'));
    expect(Search.prototype.search).toHaveBeenCalledWith(['term1', 'term2']);
  });

  it('should not add an empty search term', () => {
    spyOn(Search.prototype, 'search').and.callThrough();

    const tableSearchInput = component.nativeElement.querySelector('bq-table-search');
    const searchInput = tableSearchInput.querySelector('input');
    searchInput.value = 'term1,term2, ';
    searchInput.dispatchEvent(new Event('change'));

    expect(Search.prototype.search).toHaveBeenCalledWith(['term1', 'term2']);
  });

  function TableTemplate() {
    return ContainerTemplate.create().contentStyle('table');
  }

  function TableSearchTemplate(disabledButton = false) {
    field = FieldTemplate.text('searchField')
    .value([])
    .styles('searchField');

    button = ButtonTemplate.create('searchButton')
    .styles('searchButton')
    .disabled(disabledButton)
    .caption('Zoeken');

    return ContainerTemplate.create('searchContainer')
    .contentStyle('table')
    .children(field, button);
  }

  function PaginationTemplate() {
    const btnFirst = ButtonTemplate.create('first')
    .caption('<<')
    .disabled(true)
    .styles('pagination');

    const btnPrevious = ButtonTemplate.create('previous')
    .caption('<')
    .disabled(true)
    .styles('pagination');

    const currentPageNumber = FieldTemplate.integer('InstanceListContainer_currentPageNumber')
    .domain({ 1: '1', 2: '2', 3: '3' })
    .styles('paginationNumber')
    .value('1');

    const btnNext = ButtonTemplate.create('next')
    .caption('>')
    .styles('pagination');

    const btnLast = ButtonTemplate.create('last')
    .caption('>>')
    .styles('pagination');

    return ContainerTemplate.create()
    .name('navigationContainer')
    .displayName('DisplayName')
    .styles('navigationContainer')
    .contentStyle('tablenavigation')
    .children(
      btnFirst,
      btnPrevious,
      currentPageNumber,
      btnNext,
      btnLast,
    );
  }

});
