import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SetParking from '../views/SetParkingView.vue';
import ParkingTime from '../views/ParkingTimeView.vue';
import NoticeBoard from '../views/NoticeView.vue';
import InquiryBoard from '../views/InquiryBoardView.vue';
import Notice from '../views/NoticeView.vue';
import BoardDetail from '../views/BoardDetailView.vue';
import NewBoard from '../views/BoardWriteView.vue';
import Report from '../views/ReportView.vue';
import ReportDetail from '../views/ReportDetailView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/setparking',
      name: 'setparking',
      component: SetParking
    },
    {
      path: '/timeset',
      name: 'timeset',
      component: ParkingTime
    },
    {
      path: '/notice',
      name: 'notice',
      component: NoticeBoard
    },
    {
      path: '/board',
      name: 'board',
      component: InquiryBoard
    },
    {
      path: '/notice',
      name: 'notice',
      component: Notice
    },
    {
      path: '/boarddetail',
      name: 'boarddetail',
      component: BoardDetail
    },
    {
      path: '/newboard',
      name: 'newboard',
      component: NewBoard
    },
    {
      path: '/report',
      name: 'report',
      component: Report
    },
    {
      path: '/reportdetail',
      name: 'reportdetail',
      component: ReportDetail
    },

  ]
})

export default router;
