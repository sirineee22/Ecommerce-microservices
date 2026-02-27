import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { ProductComponent } from './product/product.component';
import { PaymentSuccessComponent } from './payment/payment-success/payment-success.component';
import { ForumComponent } from './forum/forum.component';
import { ForumHomeComponent } from './forum/forum-home/forum-home.component';
import { DiscussionDetailComponent } from './forum/discussion-detail/discussion-detail.component';
import { NewPostComponent } from './forum/new-post/new-post.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'products/:id',
    component: ProductComponent,
  },
  {
    path: 'PaymentSuccess',
    component: PaymentSuccessComponent,
  },
  {
    path: 'forum',
    component: ForumComponent,
    children: [
      { path: '', component: ForumHomeComponent },
      { path: 'new', component: NewPostComponent },
      { path: 'discussions/:id', component: DiscussionDetailComponent },
    ],
  },
];
