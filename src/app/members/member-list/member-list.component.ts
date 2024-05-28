import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../Services/members.service';
import { Member } from '../../Model/member';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  constructor( private memberService: MembersService) {
    
  }
  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers().subscribe({
      next: members => this.members = members
    })
  }

}
