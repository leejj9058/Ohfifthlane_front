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
import Search from '../views/SearchView.vue';
import Login from '../views/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/setParking',
      name: 'setParking',
      component: SetParking
    },
    {
      path: '/timeSet',
      name: 'timeSet',
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
      path: '/boardDetail/:noticeId',  // 동적 라우트 경로
      name: 'boardDetail',
      component: BoardDetail
    },
    {
      path: '/newBoard',
      name: 'newBoard',
      component: NewBoard
    },
    {
      path: '/report',
      name: 'report',
      component: Report
    },
    {
      path: '/reportDetail',
      name: 'reportDetail',
      component: ReportDetail
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/updateRegister',
      name: 'updateRegister',
      component: () => import('../views/UpdateRegisterView.vue')
    },
    {
      path: '/findId',
      name: 'findId',
      component: () => import('../views/FindIdView.vue')
    },
    {
      path: '/findPassword',
      name: 'findPassword',
      component: () => import('../views/FindPwView.vue')
    },
    {
      path: '/updatePw',
      name: 'updatePw',
      component: () => import('../views/UpdatePwView.vue')
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import('../views/ExchangePointView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }

    

  ]
})

export default router;
