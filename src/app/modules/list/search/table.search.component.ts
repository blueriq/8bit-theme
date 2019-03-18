import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Search } from '@blueriq/angular/lists';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bq-table-search',
  templateUrl: './table.search.component.html',
  styleUrls: ['./table.search.component.scss'],
})
export class TableSearchComponent implements OnInit, OnDestroy {

  @ViewChild('inputField')
  inputField: ElementRef;

  @Input()
  public search: Search;

  searchTerms: string[] = [];
  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.search.searchTerms$.subscribe((updatedSearchTerms) => {
      this.searchTerms = updatedSearchTerms;
    });
  }

  change() {
    let values = this.inputField.nativeElement.value.toLowerCase().trim().split(',').filter(Boolean);
    values = Array.from(new Set(values));
    this.searchTerms = values;
    this.doSearch();
  }

  doSearch(): void {
    this.search.search(this.searchTerms);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
