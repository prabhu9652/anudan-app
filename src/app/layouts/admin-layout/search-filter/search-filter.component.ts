import { Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
declare var require: any;
import * as $ from "jquery";
const Mark = require('mark.js');

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnChanges {

  currentIndex: number = 0;
  offsetTop: number = 210;
  searchString: string;

  @Input("ready") ready = false;
  @Output() filterCriteria = new EventEmitter();
  @Output() highlightDone = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property === 'ready') {
        if (this.ready) {
          this.highlightText(this.searchString);
          this.highlightDone.emit(false);
          this.ready = false;
        }
      }
    }
  }
  startFilter(val) {
    this.filterCriteria.emit(val);
    this.searchString = val;
  }

  highlightText(val) {
    if (val === undefined) {
      return;
    }
    let ctx = document.querySelectorAll('.search-context');
    var instance = new Mark(ctx);

    instance.unmark({
      done: function () {
        instance.mark(val, {
          separateWordSearch: false,
          done: function () {
            this.results = $(ctx).find("mark");
            this.currentIndex = 0;

            if (this.results.length) {
              var position,
                $current = this.results.eq(this.currentIndex);
              this.results.removeClass('current');
              if ($current.length) {
                $current.addClass('current');
                position = $current.offset().top - this.offsetTop;
                window.scrollTo(0, position);
              }
            }
          }
        });
      }
    });
  }

  navgiateToSearch(direction: any) {
    let marks = $('mark');
    let currentMark = $('mark.current');
    if (marks.length > 0) {
      $(marks[this.currentIndex]).removeClass('current');
      this.currentIndex += direction === 'forward' ? 1 : -1;
      if (this.currentIndex === (marks.length)) {
        this.currentIndex = 0;
      }
      if (this.currentIndex === -1) {
        this.currentIndex = marks.length - 1;
      }
      $(marks[this.currentIndex]).addClass('current');
      let position = $(marks[this.currentIndex]).offset().top - $('.main-content').offset().top;//$(marks[this.currentIndex]).parent().find('.grants-section').offset().top;
      //$('#grantsContent').scrollTo(0, position);
      if (direction === 'forward') {
        var bottom = $('.main-content').offset().top + $('.main-content').height();
        if (position > bottom) {
          $('.main-content').animate({
            scrollTop: $('.main-content').scrollTop() + $(marks[this.currentIndex - 1]).parent().closest('.grants-section').offset().top
          }, 500);
        } else if (this.currentIndex === 0) {
          $('.main-content').animate({
            scrollTop: $('.container-fluid').offset().top - $(marks[this.currentIndex]).offset().top
          }, 500);
        }
      } else if (direction === 'backward') {
        var top = $('.main-content').offset().top;
        if (position < top && this.currentIndex !== 0) {
          $('.main-content').animate({
            scrollTop: $('.main-content').scrollTop() + $(marks[this.currentIndex - 1]).parent().closest('.grants-section').offset().top
          }, 500);
        } else if (position < top && this.currentIndex === 0) {
          $('.main-content').animate({
            scrollTop: $(marks[this.currentIndex]).parent().parent().parent().offset().top
          }, 500);
        } else if (this.currentIndex === marks.length - 1) {
          $('.main-content').animate({
            scrollTop: $('.container-fluid').offset().top + $(marks[this.currentIndex]).offset().top
          }, 500);
        }
      }
    }
  }

  closeSearch() {
    this.highlightText('');
    this.filterCriteria.emit('');
    this.currentIndex = 0;
    let marks = $('mark');
    $('.main-content').animate({
      scrollTop: 0
    }, 500);
    this.close.emit(true);
  }
}
