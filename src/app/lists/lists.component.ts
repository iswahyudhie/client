import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LikesService } from '../Services/likes.service';
import { Member } from '../Model/member';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [ButtonsModule, FormsModule, MemberCardComponent, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.likeService.paginatedResult.set(null);
  }
  likeService = inject(LikesService);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.likeService.getLikes(this.predicate, this.pageNumber, this.pageSize);
  }

  getTitle(){
    switch (this.predicate) {
      case 'liked': return 'Member you like';
      case 'likedBy' : return 'Members who like you';
      default: return 'Mutual'
    }
  }

  pageChanged(event: any){
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }

}
