import { Component, Input, OnInit } from '@angular/core';
import { Filter2, FilteredColumn } from '@blueriq/angular/lists';
import { FilterCandidate } from './types';

const MAX_FILTERS = 8;

@Component({
  selector: 'bq-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  @Input()
  filter: Filter2;

  filterCandidates: FilterCandidate[];
  showUnknownLabel: string;
  showDialog = false;

  ngOnInit(): void {
    this.updateCandidates(this.filter.currentFilters.all.map(filter => new FilterCandidate(filter)));
    this.showUnknownLabel = this.filter.currentColumns.map(c => c.showUnknownLabel)[0] || '';
  }

  canAddFilter(): boolean {
    return this.filterCandidates.length < MAX_FILTERS;
  }

  addFilter(): void {
    if (this.canAddFilter()) {
      this.filterCandidates.push(new FilterCandidate());
    }
  }

  applyFilters(): void {
    const filteredColumns = this.filterCandidates
    .map(candidate => candidate.toFilteredColumn())
    .filter((filter): filter is FilteredColumn => !!filter);
    this.filter.apply(filteredColumns);
    this.showDialog = false;
  }

  clearFilters(): void {
    this.filter.currentFilters.clear();
    this.filterCandidates = [new FilterCandidate()];
  }

  removeFilter(candidateToRemove: FilterCandidate): void {
    this.updateCandidates(this.filterCandidates.filter(candidate => candidate !== candidateToRemove));
  }

  showFilter(): void {
    this.showDialog = !this.showDialog;
  }

  private updateCandidates(candidates: FilterCandidate[]): void {
    this.filterCandidates = candidates.length > 0 ? candidates : [new FilterCandidate()];
  }

}
