import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../Model/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../Services/likes.service';
import { PresenceService } from '../../Services/presence.service';

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
  private presenceService = inject(PresenceService);
  hasliked = computed(() => this.likeService.likedIds().includes(this.member().id));
  isOnline = computed(() => this.presenceService.onlineUsers().includes(this.member().username));

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
