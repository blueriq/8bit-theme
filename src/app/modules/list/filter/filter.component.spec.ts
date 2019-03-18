import { CurrentFilters, Filter2 } from '@blueriq/angular/lists';
import { FilterComponent } from './filter.component';
import { FilterCandidate } from './types';

describe('FilterComponent', () => {
  let tableFilterComponent: FilterComponent;
  let currentFiltersSpy: CurrentFilters;
  let filter: Filter2;

  beforeEach(() => {
    currentFiltersSpy = {
      all: [],
      clear: jasmine.createSpy(),
    } as unknown as CurrentFilters;

    tableFilterComponent = new FilterComponent();
    filter = {
      currentFilters: currentFiltersSpy,
      currentColumns: [],
      apply: jasmine.createSpy(),
    } as unknown as Filter2;
    tableFilterComponent.filter = filter;
    tableFilterComponent.ngOnInit();
  });

  it('open dialog for filtering', () => {
    expect(tableFilterComponent.showDialog).toBeFalsy();

    // SUT
    tableFilterComponent.showFilter();

    // verify
    expect(tableFilterComponent.showDialog).toBeTruthy();
  });

  it('close dialog on filter', () => {
    // SUT
    // show filter dialog
    tableFilterComponent.showFilter();
    // filter, so dialog closes
    tableFilterComponent.applyFilters();

    // verify
    expect(tableFilterComponent.showDialog).toBeFalsy();
  });

  it('should clear the filter and always leave a candidate', () => {
    tableFilterComponent.clearFilters();

    // verify
    expect(currentFiltersSpy.clear).toHaveBeenCalledTimes(1);
    // always leave an empty filter to quickly start filtering again
    expect(tableFilterComponent.filterCandidates.length).toEqual(1);
  });

  it('adding and removing filters', () => {
    // SUT
    tableFilterComponent.addFilter();
    tableFilterComponent.addFilter();

    // verify
    expect(tableFilterComponent.filterCandidates.length).toEqual(3);

    // remove a filter
    tableFilterComponent.removeFilter(tableFilterComponent.filterCandidates[0]);
    expect(tableFilterComponent.filterCandidates.length).toEqual(2);

    // remove a filter that is not in the list, does not change the list
    tableFilterComponent.removeFilter(new FilterCandidate());
    expect(tableFilterComponent.filterCandidates.length).toEqual(2);
  });

});
