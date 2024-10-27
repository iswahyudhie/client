import { Component, OnDestroy, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { Member } from '../../Model/member';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from '../../Services/message.service';
import { PresenceService } from '../../Services/presence.service';
import { AccountService } from '../../Services/account.service';
import { HubConnectionState } from '@microsoft/signalr';


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs',{static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  presenceService = inject(PresenceService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        if(this.member){
          for (const photo of this.member.photos) {
            this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))      
          }
        }       
      }
    })

    this.route.paramMap.subscribe({
      next: _ => this.onRouteParamsChange()
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  selectTab(heading: string){
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }

  onRouteParamsChange() {
    const user = this.accountService.currentUser();
    if(!user) return;
    if (this.messageService.hubConnection?.state === HubConnectionState.Connected && this.activeTab?.heading == 'Messages') {
      this.messageService.hubConnection.stop().then(() => {
        this.messageService.createHubConnection(user, this.member.username);
      })
      
    }
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: this.activeTab.heading},
      queryParamsHandling: 'merge'
    });
    if (this.activeTab.heading === 'Messages' && this.member) {
      const user = this.accountService.currentUser();
      if (!user) return;
      this.messageService.createHubConnection(user, this.member.username)
    } else {
      this.messageService.stopHubConnection();
    }
  }

  // LoadMember(){
  //   const user = this.route.snapshot.paramMap.get('username');
  //   if (!user) return;
  //   this.memberService.getMember(user).subscribe({
  //     next: user => {
  //       this.member = user
  //       this.GetImages()
  //     }
  //   });
  // }

  GetImages(){
    if(!this.member) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))      
    }
  }

}
