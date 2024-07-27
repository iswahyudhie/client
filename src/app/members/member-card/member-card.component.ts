import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../Model/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../Services/likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  member = input.required<Member>()
  private likeService = inject(LikesService);
  hasliked = computed(() => this.likeService.likedIds().includes(this.member().id));

  toggleLike(){
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () =>{
        if (this.hasliked()) {
          this.likeService.likedIds.update(ids => ids.filter(x => x !== this.member().id))
        }
        else  {
          this.likeService.likedIds.update(ids => [...ids,this.member().id])
        }
      }
    })
  }
}
