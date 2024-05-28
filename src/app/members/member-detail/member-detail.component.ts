import { Component, OnInit, inject } from '@angular/core';
import { Member } from '../../Model/member';
import { MembersService } from '../../Services/members.service';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  memberService: MembersService;
  route: ActivatedRoute;
  images: GalleryItem[] = [];

  constructor () {
    this.memberService = inject(MembersService);
    this.route = inject(ActivatedRoute);
  }

  ngOnInit(): void {
    this.LoadMember();
  }

  LoadMember(){
    const user = this.route.snapshot.paramMap.get('username');
    if (!user) return;
    this.memberService.getMember(user).subscribe({
      next: user => {
        this.member = user
        this.GetImages()
      }
    });
  }

  GetImages(){
    if(!this.member) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))      
    }
  }

}
