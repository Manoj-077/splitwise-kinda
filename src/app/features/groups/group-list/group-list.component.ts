import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from '../../../models/group.model';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  users: User[] = [];
  loading = false;

  form = this.fb.group({
    name: ['', [Validators.required]],
    members: [[] as number[]]
  });

  constructor(
    private groupsService: GroupsService,
    private usersService: UsersService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.form.patchValue({ members: [currentUser.id] });
    }
  }

  loadData(): void {
    this.groupsService.getGroups().subscribe((groups) => (this.groups = groups));
    this.usersService.getUsers().subscribe((users) => (this.users = users));
  }

  isMemberChecked(id: number): boolean {
    return this.form.value.members?.includes(id) ?? false;
  }

  toggleMember(id: number): void {
    const members = new Set(this.form.value.members ?? []);
    if (members.has(id)) {
      members.delete(id);
    } else {
      members.add(id);
    }
    this.form.patchValue({ members: Array.from(members) });
  }

  create(): void {
    if (this.form.invalid || !this.form.value.members?.length) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.groupsService
      .createGroup({
        name: this.form.value.name ?? '',
        members: this.form.value.members ?? []
      })
      .subscribe({
        next: (group) => {
          this.groups = [...this.groups, group];
          this.form.reset({ name: '', members: this.form.value.members });
        },
        error: () => (this.loading = false),
        complete: () => (this.loading = false)
      });
  }

  goTo(group: Group): void {
    this.router.navigate(['/groups', group.id]);
  }
}
